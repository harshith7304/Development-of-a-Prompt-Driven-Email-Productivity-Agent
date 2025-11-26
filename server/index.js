const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const INBOX_FILE = path.join(DATA_DIR, 'inbox.json');
const PROMPTS_FILE = path.join(DATA_DIR, 'prompts.json');

// API Key Rotation Logic
const apiKeys = [
  process.env.GROQ_API_KEY || 'gsk_placeholder_key_1',
  'gsk_placeholder_key_2'
];
let currentKeyIndex = 0;
let groq = new Groq({ apiKey: apiKeys[currentKeyIndex] });

console.log(`Initialized with API Key Index: ${currentKeyIndex}`);

// Helper to handle rate limits and rotation
const makeGroqRequest = async (operation) => {
  // Try as many times as we have keys
  for (let i = 0; i < apiKeys.length; i++) {
    try {
      return await operation();
    } catch (error) {
      // Check for Rate Limit (429) or specific error code
      if (error.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
        console.warn(`⚠️ Rate limit exceeded with key index ${currentKeyIndex}. Switching keys...`);

        // Rotate Key
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        groq = new Groq({ apiKey: apiKeys[currentKeyIndex] });

        console.log(`🔄 Switched to API Key Index: ${currentKeyIndex}`);
        // Loop continues to retry with new key
      } else {
        console.error("Groq API Error:", JSON.stringify(error, null, 2)); // Enhanced logging
        throw error;
      }
    }
  }
  throw new Error('All API keys exhausted or rate limited.');
};

// Helper functions for data
const readJson = (file) => {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const writeJson = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Routes

// Get Emails
app.get('/api/emails', async (req, res) => {
  const emails = readJson(INBOX_FILE);
  res.json(emails);
});

// Get Prompts
app.get('/api/prompts', (req, res) => {
  const prompts = readJson(PROMPTS_FILE);
  res.json(prompts);
});

// Update Prompts
app.post('/api/prompts', (req, res) => {
  writeJson(PROMPTS_FILE, req.body);
  res.json({ success: true });
});

// Update API Key (Config)
app.post('/api/config', (req, res) => {
  const { newApiKey } = req.body;
  if (!newApiKey) return res.status(400).json({ error: 'API Key is required' });

  // Add new key to the start of the rotation
  apiKeys.unshift(newApiKey);
  currentKeyIndex = 0;
  groq = new Groq({ apiKey: apiKeys[currentKeyIndex] });

  console.log('✅ API Key updated and added to rotation.');
  res.json({ success: true });
});

// Process Email (Categorize & Extract)
app.post('/api/process', async (req, res) => {
  const { emailId } = req.body;
  const emails = readJson(INBOX_FILE);
  const prompts = readJson(PROMPTS_FILE);

  const emailIndex = emails.findIndex(e => e.id === emailId);
  if (emailIndex === -1) return res.status(404).json({ error: 'Email not found' });

  const email = emails[emailIndex];

  try {
    // 1. Categorize
    const catCompletion = await makeGroqRequest(() => groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompts.categorization },
        { role: 'user', content: `Subject: ${email.subject}\nBody: ${email.body}` }
      ],
      model: 'llama-3.3-70b-versatile',
    }));
    const category = catCompletion.choices[0]?.message?.content?.trim() || 'Uncategorized';

    // 2. Extract Actions
    const actionCompletion = await makeGroqRequest(() => groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompts.action_item },
        { role: 'user', content: `Subject: ${email.subject}\nBody: ${email.body}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    }));

    let actions = { tasks: [] };
    try {
      actions = JSON.parse(actionCompletion.choices[0]?.message?.content || '{}');
    } catch (e) {
      console.error("Failed to parse JSON actions", e);
    }

    // Update Email
    emails[emailIndex] = { ...email, category, actions, processed: true };
    writeJson(INBOX_FILE, emails);

    res.json({ success: true, email: emails[emailIndex] });
  } catch (error) {
    console.error('LLM Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Chat Agent
app.post('/api/chat', async (req, res) => {
  const { message, contextEmailId } = req.body;
  const emails = readJson(INBOX_FILE);

  let systemPrompt = "You are a helpful Email Productivity Agent. You have access to the user's emails. ALWAYS format your responses using Markdown. Use bullet points for lists, bold text for important details (like **Subject** or **From**), and keep responses concise and easy to read.";
  let userContent = message;

  if (contextEmailId) {
    const email = emails.find(e => e.id === contextEmailId);
    if (email) {
      systemPrompt += `\n\nCurrently viewing email:\nSubject: ${email.subject}\nFrom: ${email.sender}\nBody: ${email.body}`;
    }
  } else {
    // Inject Inbox Summary
    const summary = emails.map(e =>
      `- ID: ${e.id}, From: ${e.sender}, Subject: ${e.subject}, Category: ${e.category || 'Uncategorized'}, Read: ${e.read}`
    ).join('\n');
    systemPrompt += `\n\nCurrent Inbox State:\n${summary}\n\nWhen asked to list or find emails, use the IDs provided.`;
  }

  try {
    const completion = await makeGroqRequest(() => groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      model: 'llama-3.3-70b-versatile',
    }));

    res.json({ reply: completion.choices[0]?.message?.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Draft (Reply or New)
app.post('/api/draft', async (req, res) => {
  const { emailId, instructions } = req.body;
  const emails = readJson(INBOX_FILE);
  const prompts = readJson(PROMPTS_FILE);

  let context = "";
  if (emailId) {
    const email = emails.find(e => e.id === emailId);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    context = `Original Email:\nSubject: ${email.subject}\nBody: ${email.body}\n\n`;
  }

  try {
    const completion = await makeGroqRequest(() => groq.chat.completions.create({
      messages: [
        { role: 'system', content: `You are an email drafting assistant. ${prompts.auto_reply} Respond in JSON format: { "subject": "...", "body": "...", "followUps": ["..."], "metadata": {...} }` },
        { role: 'user', content: `${context}User Instructions: ${instructions || 'Draft an email.'}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    }));

    const draftData = JSON.parse(completion.choices[0]?.message?.content || '{}');
    res.json({ draft: draftData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Save Draft (Reply)
app.post('/api/emails/:id/draft', (req, res) => {
  const { id } = req.params;
  const { draft } = req.body;
  const emails = readJson(INBOX_FILE);
  const index = emails.findIndex(e => e.id === id);

  if (index === -1) return res.status(404).json({ error: 'Email not found' });

  emails[index].draft = draft;
  writeJson(INBOX_FILE, emails);
  res.json({ success: true, email: emails[index] });
});

// Create New Draft (Standalone)
app.post('/api/emails/draft', (req, res) => {
  const { draft } = req.body;
  const emails = readJson(INBOX_FILE);

  const newEmail = {
    id: Date.now().toString(),
    sender: 'me@company.com', // Self
    subject: draft.subject || '(No Subject)',
    body: draft.body || '',
    timestamp: new Date().toISOString(),
    read: true,
    category: 'Draft',
    isDraft: true,
    draft: draft
  };

  emails.unshift(newEmail);
  writeJson(INBOX_FILE, emails);
  res.json({ success: true, email: newEmail });
});

// Reset Inbox
app.post('/api/reset', (req, res) => {
  const emails = readJson(INBOX_FILE);
  const updatedEmails = emails.map(email => {
    if (email.isDraft) return email;
    const { category, actions, processed, ...rest } = email;
    return rest;
  });
  writeJson(INBOX_FILE, updatedEmails);
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

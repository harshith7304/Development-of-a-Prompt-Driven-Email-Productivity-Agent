# AIMail - Prompt-Driven Email Productivity Agent

> **🚀 Live Demo:** [Click here to view the deployed application](https://development-of-a-prompt-driven-emai.vercel.app/)


AIMail is a next-generation email client designed to enhance productivity through AI-driven features. It provides a powerful agentic interface to manage your inbox with a modern, familiar design.

## Key Features

### 1. AI-Powered Agent (AIGPT) 🤖
- **Context-Aware Chat**: Ask questions about your current email or your entire inbox.
- **Auto-Categorization**: Automatically classifies emails into categories like Work, Personal, Urgent, etc.
- **Bulk Processing**: "Classify All" button to process your entire inbox at once.

### 2. Smart Composing ✍️
- **Draft with AI**: Provide a simple instruction (e.g., "Decline the meeting politely"), and AIGPT will generate a full email draft for you.
- **Follow-up Suggestions**: Automatically suggests internal notes or follow-up actions.

### 3. Modern UI/UX 🎨
- **Gmail-like Layout**: Familiar 3-pane design with a collapsible sidebar.
- **Dark Mode**: Sleek, glassmorphism-inspired interface.
- **Category Filtering**: Easily filter emails by category (Urgent, Work, Personal, etc.).

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Groq API Key

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project root.
2.  **Install Dependencies**:
    ```bash
    # Server
    cd server
    npm install

    # Client
### Configuration

1.  Open the app in your browser.
2.  Go to **Brain & Config** in the sidebar.
3.  **API Key**: Enter your Groq API Key.
4.  **Prompts**: Customize the system prompts for the agent.

## Usage Guide

- **Inbox**: View your emails. Use the sidebar to filter by category.
- **Classify All**: Click the brain icon in the Inbox header to auto-categorize all emails.
- **Agent Chat**: Click the Sparkle icon (✨) in the top right to open the AIGPT drawer.
- **Compose**: Click "+" to draft a new email. Use "Draft with AI" to generate content.

## Troubleshooting

- **Agent Not Responding**: Verify your Groq API Key is correct and has credits.(it has built in keys but they have limits if crossed you may face issues try changing it in brain & config)

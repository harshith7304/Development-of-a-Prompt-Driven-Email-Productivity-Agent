- **Prompt-Driven Architecture**: All agent behaviors (categorization, extraction, drafting) are controlled by user-editable prompts.
- **Intelligent Processing**:
  - **Categorization**: Automatically tags emails (Important, Spam, To-Do, etc.).
  - **Action Item Extraction**: Identifies tasks and deadlines.
- **Agent Chat**: Chat with your inbox to summarize emails or ask questions.
- **Draft Generation**: Auto-draft replies based on context and user instructions.
- **Premium UI**: Modern, glassmorphism-inspired interface built with React and Vite.

## Setup Instructions

### Prerequisites
- Node.js installed.
- A Groq API Key (Default provided, can be changed in settings).

### Installation

1. **Clone the repository** (if applicable) or navigate to the project folder.

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd client
   npm install
   ```

## How to Run

1. **Start the Backend Server**:
   ```bash
   cd server
   node index.js
   ```
   The server will run on `http://localhost:3001`.

2. **Start the Frontend Application**:
   ```bash
   cd client
   npm run dev
   ```
   The application will open at `http://localhost:5173` (or similar).


## Stopping the Application

To stop the application cleanly:

1. **Stop the Frontend**:
   - Go to the terminal window running the frontend (`npm run dev`).
   - Press `Ctrl + C`.
   - Type `y` (if prompted) and press Enter to confirm termination.

2. **Stop the Backend**:
   - Go to the terminal window running the backend (`node index.js`).
   - Press `Ctrl + C` to terminate the process.

## Usage Guide

### 1. Loading the Mock Inbox
The application automatically loads the mock inbox from `server/data/inbox.json` on startup. You can view the emails in the "Inbox" tab.

### 2. Processing Emails
- Click on an email in the Inbox.
- Click the **"Analyze Email"** button.
- The agent will use the stored prompts to:
  - Categorize the email (displayed as a badge).
  - Extract action items (displayed in a list).

### 3. Drafting Replies
- In the Email Detail view, scroll to the "Draft Reply" section.
- Enter instructions (e.g., "Polite decline") or leave blank for a default reply.
- Click **"Generate Draft"**.
- The agent will generate a response based on the email context and your instructions.

### 4. Agent Chat
- Navigate to the **"Agent Chat"** tab.
- Select an email from the sidebar to set the context.
- Ask questions like:
  - "Summarize this email."
  - "What is the deadline mentioned?"
  - "Write a short response."

### 5. Configuring Prompts ("The Brain")
- Navigate to the **"Brain & Config"** tab.
- **API Key**: Update your Groq API Key here if needed.
- **Prompts**: Edit the system prompts for Categorization, Action Extraction, and Auto-Reply.
- Click **"Save Configuration"** to apply changes immediately.

## Project Structure

- `client/`: React frontend (Vite).
- `server/`: Node.js/Express backend.
- `server/data/inbox.json`: Mock email data.
- `server/data/prompts.json`: Stored user prompts.

## Technology Stack
- **Frontend**: React, Vite, Vanilla CSS (Glassmorphism), Lucide Icons.
- **Backend**: Node.js, Express.
- **AI/LLM**: Groq SDK (Llama 3.3 70B).

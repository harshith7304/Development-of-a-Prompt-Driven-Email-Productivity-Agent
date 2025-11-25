# Deployment Guide for AIMail

This guide will walk you through deploying the AIMail application. We will host the **Backend (Server)** on [Render](https://render.com) and the **Frontend (Client)** on [Vercel](https://vercel.com).

## Prerequisites
- A GitHub account.
- This project pushed to a GitHub repository.

---

## Part 1: Deploying the Backend (Server) on Render

1.  **Sign Up/Login**: Go to [Render.com](https://render.com) and log in with your GitHub account.
2.  **New Web Service**: Click "New +" and select "Web Service".
3.  **Connect Repository**: Connect your GitHub repository containing the AIMail project.
4.  **Configure Service**:
    - **Name**: `aimail-server` (or similar)
    - **Root Directory**: `server` (Important!)
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node index.js`
    - **Plan**: Free
5.  **Environment Variables**:
    - Scroll down to "Environment Variables" and add:
        - Key: `GROQ_API_KEY` (Optional, if you want to hardcode it, but the app allows setting it in the UI)
6.  **Deploy**: Click "Create Web Service".
7.  **Copy URL**: Once deployed, copy the service URL (e.g., `https://aimail-server.onrender.com`). You will need this for the frontend.

> **Note**: The free tier on Render spins down after inactivity. The first request might take a minute to load.

---

## Part 2: Deploying the Frontend (Client) on Vercel

1.  **Update API URL**:
    - Before deploying, you need to tell the frontend where the backend lives.
    - Open `client/src/services/api.js`.
    - Change `const API_URL = 'http://localhost:3001/api';` to your Render URL:
      ```javascript
      const API_URL = 'https://aimail-server.onrender.com/api'; // Replace with your actual Render URL
      ```
    - Commit and push this change to GitHub.

2.  **Sign Up/Login**: Go to [Vercel.com](https://vercel.com) and log in with GitHub.
3.  **Add New Project**: Click "Add New..." -> "Project".
4.  **Import Repository**: Select your AIMail repository.
5.  **Configure Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: Click "Edit" and select `client`.
6.  **Deploy**: Click "Deploy".
7.  **Visit**: Once complete, Vercel will give you a live URL for your application!

---

## Important Notes

- **Data Persistence**: On the free tier of Render, the filesystem is ephemeral. This means `inbox.json` will reset every time the server restarts (which happens frequently on the free tier). For a demo, this is usually fine. For a real app, you would use a database (MongoDB/PostgreSQL).
- **CORS**: If you encounter CORS errors, you might need to update `server/index.js` to allow the Vercel domain in the `cors` configuration:
  ```javascript
  app.use(cors({
    origin: 'https://your-vercel-app.vercel.app'
  }));
  ```
  (By default, `app.use(cors())` allows all origins, which is fine for testing).

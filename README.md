# ClariMed 🩺 - AI Medical Report Simplifier & Voice Assistant

ClariMed is a state-of-the-art, full-stack, responsive web application designed for patients to clarify complex medical reports (blood work, scans, prescriptions) using Google Gemini AI. It transcribes medical report scans (images or PDFs) using unified OCR, parses key health constants, and translates technical jargon into warm, conversational, simplified paragraphs.

An empathetic AI voice assistant named **Claria** reads the simplified explanation aloud in **English, Hindi, Tamil, or Telugu** to ensure maximum accessibility and patient comfort.


---

## 📂 Project Directory Structure

```text
clarimed/
├── data/                    # Local persistent storage database
│   └── db.json              # File-based JSON Database (Simulates SQL Tables)
├── server/                  # Backend modules running on the server
│   └── db.ts                # Database query methods & SHA-256 Auth helpers
├── src/                     # Frontend source code (Vite + React)
│   ├── hooks/               # Custom React Hooks
│   │   └── useSpeech.ts     # HTML5 SpeechSynthesis Voice Assistant Hook
│   ├── pages/               # Primary interactive pages
│   │   ├── Login.tsx        # Soothing Pastel Login page
│   │   ├── Register.tsx     # Patient registration page
│   │   └── Dashboard.tsx    # File Drag-and-Drop, Gemini analysis & TTS Player
│   ├── App.tsx              # React state router & Session syncer
│   ├── index.css            # Global CSS, Font face, & Tailwind v4 themes
│   ├── main.tsx             # React client entry point
│   └── types.ts             # Global TypeScript shared type contracts
├── .env.example             # Template for secure API configuration
├── .gitignore               # Excludes large modules and generated cache
├── index.html               # Main HTML wrapper template
├── metadata.json            # AI Studio applet configurations
├── package.json             # Build configurations & module script lists
├── tsconfig.json            # Strict TypeScript compiler options
└── vite.config.ts           # Vite middleware and proxy server settings
```

### Why Every Folder Exists:
*   **`data/`**: Holds the local persistent file `db.json`. It acts as a lightweight SQLite alternative, making database records readable, fully searchable, and immune to native compilation crashes on Cloud Run containers.
*   **`server/`**: Contains pure Node.js/Express server-side files. This handles secure logic (password hashing and database writes) and prevents exposing the `GEMINI_API_KEY` to the client-side browser bundle.
*   **`src/`**: The frontend React container housing UI pages, global styles, and client Hooks.
*   **`src/hooks/`**: Houses utility hooks like `useSpeech` which encapsulates browser hardware integrations separately from layout render engines.
*   **`src/pages/`**: Houses self-contained views (`Login`, `Register`, `Dashboard`) promoting modular React engineering practices.

---

## 🚀 Complete Full-Stack Local Setup Guide

Follow these steps to run ClariMed on your local computer from absolute scratch.

### Prerequisites (Install first)
1.  **Node.js (v18 or higher)**: Download and run the installer from [nodejs.org](https://nodejs.org/). This installs both `node` and `npm`.

### Step 1: Open VS Code & Open Terminal
1.  Launch **VS Code**.
2.  Click **File > Open Folder...** and select the `clarimed` folder.
3.  Open the integrated terminal by pressing ``Ctrl + ` `` (control + backtick) or going to **Terminal > New Terminal** in the top menu.

### Step 2: Install Project Dependencies
Run the following command in the VS Code terminal to install all full-stack Node packages:
```bash
npm install
```

### Step 3: Configure your Environment Variables
Create a local secret configuration file called `.env` in the root folder (where `package.json` resides).
```bash
# On Windows (PowerShell)
New-Item .env

# On Mac/Linux (Terminal)
touch .env
```
Open the `.env` file in VS Code and paste your Gemini API key (Obtain a free key from [Google AI Studio](https://aistudio.google.com/)):
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY_HERE"
```

### Step 4: Run the Development Server
Launch the unified full-stack developer server:
```bash
npm run dev
```
**Expected Output:**
```text
ClariMed Full-stack Server listening on http://localhost:3000
```
Open your browser and navigate to `http://localhost:3000` to register your account and test the application!

---

## 🛠️ VS Code Beginner Guide

*   **Create Folders**: Right-click the Explorer pane in VS Code (left side) and select **New Folder**. Enter the name (e.g., `server`).
*   **Create Files**: Right-click any folder or the Explorer pane, select **New File**, type the full name (e.g., `server.ts`), and press Enter.
*   **Pasting Code**: Copy the complete codes provided below, click inside the target VS Code file, select all existing text with `Ctrl + A` (or `Cmd + A` on Mac), and paste with `Ctrl + V` (or `Cmd + V`).
*   **Save File**: Press `Ctrl + S` (or `Cmd + S` on Mac) after editing to save the changes. An unsaved file displays a solid circle next to its name in the tab bar.

---

## 🐙 Git & GitHub Beginner Guide

Deploy your project and publish it on GitHub using these exact terminal steps:

### 1. Initialize Git Repo
Initializes a clean local Git tracking vault inside your folder.
```bash
git init
```

### 2. Stage Changes
Saves a snapshot of all active files to the staging deck.
```bash
git add .
```

### 3. Record Initial Commit
Records your staged snapshot locally with an index message.
```bash
git commit -m "feat: complete ClariMed AI medical simplifier"
```

### 4. Create Main Branch
Forces the default tracking branch name to `main`.
```bash
git branch -M main
```

### 5. Link to GitHub
Go to [github.com](https://github.com/), create a new empty repository named `clarimed`, copy the remote link, and link your local Git folder:
```bash
git remote add origin https://github.com/your-username/clarimed.git
```

### 6. Push to GitHub
Uploads your local files to your cloud GitHub repository.
```bash
git push -u origin main
```

---

## ☁️ Production Deployment Guide (Vercel + Render)

To make ClariMed public and accessible to anyone on the web:

### Part A: Deploy the Backend to Render
1.  Sign in to [Render.com](https://render.com/) and click **New > Web Service**.
2.  Connect your **GitHub repository** containing the ClariMed project.
3.  Configure the environment settings on Render:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  Navigate to **Environment Variables** in the left menu and add:
    *   `GEMINI_API_KEY`: *(Paste your Google AI Studio API key)*
    *   `NODE_ENV`: `production`
5.  Click **Deploy Web Service**. Once built, copy your live backend URL (e.g., `https://clarimed-backend.onrender.com`).

### Part B: Deploy the Frontend to Vercel
1.  Sign in to [Vercel.com](https://vercel.com/) and click **Add New > Project**.
2.  Import your **GitHub repository**.
3.  Vercel will automatically detect the Vite React configuration. Click **Deploy**.
4.  Once deployed, Vercel gives you a live client-side URL (e.g., `https://clarimed.vercel.app`).

---

## 🩺 Final Patient Testing Checklist

Confirm everything is functioning perfectly before showcasing:
- [ ] **Registration**: Enter a new email/password; confirm you are redirected to the Dashboard instantly.
- [ ] **Login**: Log out and log back in; verify your credential hashing functions operate flawlessly.
- [ ] **File Drag & Drop**: Drop a PNG/JPEG blood test result; verify file boundaries change state.
- [ ] **AI Report OCR & Analysis**: Choose 'Hindi' or 'English', select a file, and click 'Clarify Report'. Confirm the progress loaders animate, and paragraphs display nicely.
- [ ] **Claria Voice Assistant**: Click 'Speak Explanation'. Confirm the audio waveform animates, and the assistant reads report paragraphs in the selected language.
- [ ] **History Logs**: Confirm your newly analyzed report is saved in 'Previous Report History', and remains loaded even after browser restarts.
- [ ] **Disclaimers**: Confirm the safety guidelines are prominently featured below all medical explanations.

# WisePrep: AI-Powered Job Interview Preparation 🚀

Prepwise is a modern web platform designed to help you ace your next job interview. Built with **Next.js** and powered by **Vapi AI voice agents** and **Google Gemini**, this app provides a realistic and effective way to practice your interview skills. Get instant feedback from an AI and boost your confidence!

---

## 📋 Table of Contents

* [Features](#Features)
* [Tech Stack](#tech-stack)
* [Quick Start](#quick-start)
* [Project Details](#project-details)
* [Community & Support](#community--support)
* [More Resources](#more-resources)

---

## ✨ Features

Prepwise offers a comprehensive set of tools to streamline your interview preparation.

* **Authentication**: Secure user sign-up and sign-in with **Firebase** password/email authentication.
* **AI-Driven Interviews**: Generate and conduct mock interviews with a realistic AI voice agent.
* **Instant Feedback**: Receive immediate, detailed feedback on your conversation and performance.
* **Modern UI/UX**: A sleek, responsive, and intuitive design built with **Tailwind CSS** and **shadcn/ui** for a great user experience.
* **Dashboard**: A centralized hub to manage and track all your interviews and progress.
* **Detailed Transcripts**: Review your interviews with full transcripts for a complete analysis.

---

## ⚙️ Tech Stack

This project is built using a powerful and modern tech stack:

* **Frontend & Backend**: Next.js
* **AI Voice Agents**: Vapi AI
* **Generative AI**: Google Gemini
* **Authentication & Database**: Firebase
* **Styling**: Tailwind CSS & shadcn/ui
* **Data Validation**: Zod

---
## 🏃 Quick Start

Follow these steps to get the Prepwise project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

* **Git**
* **Node.js** (and npm)

### Cloning the Repository

First, clone the project and navigate into its directory:

```bash
git clone [https://github.com/PatelJayy/mock_interview_platform.git]
cd mock_interview_platform
```

Feedback Display Page: app/(root)/interview/[id]/feedback/page.tsx

##nstallation
Install the project dependencies with npm:

```bash
npm install
```

## Environment Variables
Create a .env.local file in the root directory and add your credentials.

```bash
NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=
GOOGLE_GENERATIVE_AI_API_KEY=
NEXT_PUBLIC_BASE_URL=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

## Running the Project
Start the development server:

```bash
npm run dev
```

The application will be live at http://localhost:3000.

📝 Project Details
This repository contains the code for a project built during an in-depth tutorial on the JavaScript Mastery YouTube channel. It's a perfect resource for visual learners to build a complete application step-by-step.

Code Snippets
For quick reference, here are some key code locations within the project:

Global Styles: globals.css

Utility Functions: lib/utils.ts

Question Generation Prompt: app/api/vapi/generate/route.tsx

Feedback Generation Action: lib/actions/general.action.ts

Feedback Display Page: app/(root)/interview/[id]/feedback/page.tsx

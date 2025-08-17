# TalkScribe 1.0

TalkScribe is a modern web application that enables users to record speech, transcribe it into text, and manage transcripts with ease. It offers both **real-time transcription** and **record-then-transcribe** options, as well as **translation support**. The application is built with **React (Next.js + TypeScript)** for the frontend and integrates an **automatic speech recognition (ASR) model** on the backend. User authentication and transcript storage are managed with a lightweight database.

---

## ✨ Features
- **User Authentication** – Sign up and log in with username, email, and password.  
- **Live Transcription** – Real-time speech-to-text transcription directly from the microphone.  
- **Record & Transcribe** – Option to record audio first, then generate a transcript after stopping.  
- **Translation** – Transcripts can be translated into other languages.  
- **Transcript History** – Access a history page that shows:  
  - Saved transcripts  
  - What was recorded in **Live Transcription**  
  - What was recorded in **Record & Transcribe**  
- **Interactive Feedback** – Buttons and UI components provide visual feedback for better usability.  

Glimpse of Features used:

---

## 🛠️ Tech Stack
- **Frontend:** React + Next.js (TypeScript), Tailwind CSS for styling.  
- **Backend:** Next.js API routes for server logic.  
- **ASR Model:** Whisper (OpenAI Whisper-Large-V3) for transcription and translation.  
- **Database:** SQLite for storing user accounts and transcript history.  

---

## 📂 Project Structure
TalkScribe1.0-main/
│── app/ # Next.js routes (UI and API)
│ ├── auth/ # Login & Signup pages
│ ├── api/transcribe/ # Whisper ASR transcription API
│── components/ # UI components (recording, transcript history, forms)
│── lib/ # Authentication & transcript storage logic
│── scripts/ # SQLite schema setup
│── public/ # Assets (images, placeholders)
│── styles/ # Global styles
│── package.json # Dependencies

---


---

## 🚀 Deployment
The application is deployed on **Netlify** and can be accessed here:  

👉 [TalkScribe Web App](https://68a0b9dc8a6e19294a99cc16--talkscrib.netlify.app/)  

---

## 📹 Demo Video
A demo video (<5 minutes) should be added here:  
[Insert link to demo video]  

The demo should cover:  
1. User signup & login  
2. Live transcription in action  
3. Record & transcribe workflow  
4. Translation option  
5. Transcript history with both live and recorded transcripts  

---

## 📦 Source Code
The source code can be downloaded from:  
[Insert GitHub or Drive link to zipped source code]  

---

## 📑 Project Requirements
This application was developed according to the following requirements:  
1. **Web UI** – Login/Signup, live transcription, record & transcribe, translation, transcript display, transcript history, and interactive feedback.  
2. **Backend** – Integration of an ASR model (Whisper) for transcription and translation.  
3. **Database** – Management of user information (account details, transcripts, live/recorded history).  
4. **Deployment** – Accessible through a single hosted link.  

---
---

## ⚠️ Disclaimer
This project is a **prototype built for educational purposes** as part of an academic assignment.  
It is not intended for production use or handling sensitive personal data.  

- User credentials and transcripts in this demo system are for testing only.  
- Environment variables provided in `.env.local` are placeholders and must be replaced with your own values.  
- The authors and maintainers are not responsible for any misuse, data exposure, or security risks if deployed outside of its intended educational context.  

# This application is a PROTOTYPE created for educational purposes only.
# It is not intended for production use or for handling sensitive user data.
# Replace the placeholders below with your own values before running locally.


TalkScribe 1.0
TalkScribe1.0 is a modern web application that enables users to record speech, transcribe it into text, and manage transcripts with ease. It offers both real-time transcription and record-then-transcribe options, as well as translation support. The application is built with React (Next.js + TypeScript) for the frontend and integrates an automatic speech recognition (ASR) model on the backend. User authentication and transcript storage are managed with a lightweight database.

✨ Features
User Authentication – Sign up and log in with username, email, and password.
Live Transcription – Real-time speech-to-text transcription directly from the microphone.
Record & Transcribe – Option to record audio first, then generate a transcript after stopping.
Translation – Transcripts can be translated into other languages.
Transcript History – Access a history page that shows:
Saved transcripts
What was recorded in Live Transcription
What was recorded in Record & Transcribe
Interactive Feedback – Buttons and UI components provide visual feedback for better usability.

Glimpse of Features used:
<img width="952" height="658" alt="Screenshot 2025-08-16 130131" src="https://github.com/user-attachments/assets/b1bfc532-787e-408a-9b7b-017180a7d10c" />
<img width="1202" height="811" alt="Screenshot 2025-08-16 130600" src="https://github.com/user-attachments/assets/1953981b-74a2-4e92-b6cd-dde0d8533466" />
<img width="1139" height="843" alt="Screenshot 2025-08-16 125932" src="https://github.com/user-attachments/assets/57d2f2b0-17da-4f13-9467-eb48e5be8d98" />
<img width="1184" height="745" alt="Screenshot 2025-08-16 130616" src="https://github.com/user-attachments/assets/b4402377-862d-4b2e-8504-9e5d31a01df1" />
<img width="1141" height="835" alt="Screenshot 2025-08-16 130035" src="https://github.com/user-attachments/assets/1c18f999-b92a-43ad-b2bf-bde58b0df9a3" />
<img width="1150" height="496" alt="Screenshot 2025-08-16 130002" src="https://github.com/user-attachments/assets/6a8a25d9-c4b2-449d-b704-af1c59319e15" />
<img width="1165" height="430" alt="Screenshot 2025-08-16 130009" src="https://github.com/user-attachments/assets/dfcc7be0-9f34-47a4-bf90-9641bc643ebc" />



🛠️ Tech Stack
Frontend: React + Next.js (TypeScript), Tailwind CSS for styling.
Backend: Next.js API routes for server logic.
ASR Model: Whisper (OpenAI Whisper-Large-V3) for transcription and translation.
Database: SQLite for storing user accounts and transcript history.

📂 Project Structure
TalkScribe1.0-main/ 
│── app/ # Next.js routes (UI and API) │ 
├── auth/ # Login & Signup pages │ 
├── api/transcribe/ # Whisper ASR transcription API 
│── components/ # UI components (recording, transcript history, forms) 
│── lib/ # Authentication & transcript storage logic 
│── scripts/ # SQLite schema setup 
│── public/ # Assets (images, placeholders) 
│── styles/ # Global styles 
│── package.json # Dependencies


🚀 Deployment
The application is deployed with the help of Netlify and can be accessed here:
https://68a0b9dc8a6e19294a99cc16--talkscrib.netlify.app/


👉 TalkScribe1.0 Web App (https://68a0b9dc8a6e19294a99cc16--talkscrib.netlify.app/)


📹 Demo Video  
A demo video (<5 minutes) should be added here:
[Insert link to demo video]


The demo should cover:
User signup & login
Live transcription in action
Record & transcribe workflow
Translation option
Transcript history with both live and recorded transcripts


📦 Source Code
The source code can be downloaded from:
https://github.com/Aashish-Hackingtheworld/TalkScribe1.0-main/


📑 Project Requirements
This application was developed according to the following requirements:
Web UI – Login/Signup, live transcription, record & transcribe, translation, transcript display, transcript history, and interactive feedback.
Backend – Integration of an ASR model (Whisper) for transcription and translation.
Database – Management of user information (account details, transcripts, live/recorded history).
Deployment – Accessible through a single hosted link.


⚠️ Disclaimer
This project is a prototype built for educational purposes as part of an academic assignment.
It is not intended for production use or handling sensitive personal data.

User credentials and transcripts in this demo system are for testing only.
Environment variables provided in .env.local are placeholders and must be replaced with your own values.
The authors and maintainers are not responsible for any misuse, data exposure, or security risks if deployed outside of its intended educational context.
This application is a PROTOTYPE created for educational purposes only.
It is not intended for production use or for handling sensitive user data.
Replace the placeholders below with your own values before running locally.

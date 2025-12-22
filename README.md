🌌 Pixel Talkz

Real-Time Community Chat with AI, Voice & Modern UX

Pixel Talkz is not just another chat app.
It’s a topic-driven, open communication platform where humans and AI interact inside conversations, not outside them.

--------

🚀 Why Pixel Talkz Exists

Most chat applications today (WhatsApp, Instagram, Telegram) are built for:
	•	Private conversations
	•	Known contacts
	•	Closed communication

But modern users need more.

❌ What existing apps don’t solve
	•	No instant way to talk with people around a topic
	•	No structured space for learning, collaboration, or discussion
	•	AI exists separately, not within chats
	•	Voice and text aren’t optimized for communities

✅ What Pixel Talkz solves
	•	Instant topic-based chat rooms
	•	Open participation (no contacts required)
	•	AI as a chat participant
	•	Voice + text designed for real conversations
	•	Clean, premium UX that feels modern and fast

--------

🎯 Vision

“Create intelligent, open spaces where ideas flow freely.”

Pixel Talkz is built for:
	•	👨‍🎓 Students & study groups
	•	👨‍💻 Developers & tech communities
	•	🎮 Gamers & hobby groups
	•	🤝 Open discussions without pressure
	•	🤖 AI-assisted conversations

----------

✨ Features

💬 Real-Time Messaging
	•	Firestore-powered live updates
	•	Optimized pagination
	•	Smooth scrolling & focus handling
	•	Reply-based conversation flow

—---------

🎤 Voice Messages
	•	Hold-to-record (WhatsApp-style)
	•	Slide-to-cancel
	•	Auto-send at 60 seconds
	•	Inline audio playback in chat

---------

🤖 AI Inside the Chat
	•	AI behaves like a real user
	•	Context-aware responses
	•	AI replies stored just like normal messages
	•	Powered by Groq (LLaMA models) via Cloudflare Workers

AI is not a popup.
AI is part of the conversation.

--------

🔁 Replies & Context
	•	Swipe to reply (mobile)
	•	Click to reply (desktop)
	•	Reply preview with jump-to-message
	•	Clear conversational threading

--------

🎨 Premium UI / UX
	•	Apple-inspired minimal design
	•	Consistent lavender → blue gradient branding
	•	Clean typography
	•	Responsive across devices
	•	Zero clutter, zero noise

--------

🌓 Personalization
	•	Light / Dark mode
	•	Persistent preferences
	•	Smooth transitions

---------

🔐 Security & Control
	•	Firebase Security Rules
	•	Admin-only chat clearing
	•	AI toggle per session
	•	Minimal data collection

---------

🏗️ Tech Stack

Frontend
	•	React + Vite
	•	Tailwind CSS
	•	Custom hooks architecture
	•	Mobile-first design

Backend
	•	Firebase Firestore (real-time database)
	•	Cloudflare Workers (AI proxy & security)

AI Layer
	•	Groq API
	•	LLaMA-based models
	•	Ultra-low latency inference
  User
  ↓
Pixel Talkz UI
  ↓
Cloudflare Worker
  ↓
Groq AI
  ↓
Firestore
  ↓
Live Chat UI

⚙️ Setup & Installation

Follow these steps to run Pixel Talkz locally on your machine.

----------

📦 Prerequisites

Make sure you have the following installed:
	•	Node.js (v18 or higher recommended)
	•	npm or pnpm
	•	Git
	•	A Firebase project
	•	A Cloudflare account (for AI Worker)
	•	AI API Key (free tier supported)

  📁 Clone the Repository
  git clone https://github.com/kishore1185/PIXELTALKZ.git
cd pixel-talkz
📥 Install Dependencies
npm install
# or
pnpm install

🔥 Firebase Setup
	1.	Go to Firebase Console
	2.	Create a new project
	3.	Enable Firestore Database
	4.	Set Firestore rules (development example):
  [rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
]

---------

🤖 AI Worker Setup (Cloudflare + Groq)

1️⃣ Create Cloudflare Worker
npm install -g wrangler
wrangler login
wrangler init pixeltalkz-ai
2️⃣ Add AI API Key
wrangler secret put AI_API_KEY
3️⃣ Deploy Worker
wrangler deploy

----------

▶️ Run the App Locally
npm run dev



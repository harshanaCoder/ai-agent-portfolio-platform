# 🚀 AI Agent Portfolio Platform

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com/?lines=AI+Portfolio+Platform;Voice+Assistant+%2B+3D+UI;Next.js+%2B+AI+Engineering;Build+Something+Extraordinary&center=true&width=600&height=50">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38B2AC?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%2B%20OpenAI-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Voice-ElevenLabs-orange?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/harshanaCoder/ai-agent-portfolio-platform?style=flat-square" />
  <img src="https://img.shields.io/github/forks/harshanaCoder/ai-agent-portfolio-platform?style=flat-square" />
  <img src="https://img.shields.io/github/issues/harshanaCoder/ai-agent-portfolio-platform?style=flat-square" />
  <img src="https://img.shields.io/github/license/harshanaCoder/ai-agent-portfolio-platform?style=flat-square" />
</p>

---

## ✨ Overview

A next-generation interactive portfolio powered by AI, voice interaction, and immersive 3D UI.

- 🎯 Traditional portfolio
- 🤖 AI assistant
- 🎙️ Voice interaction
- 🌌 3D experience

---

## 🔥 Key Features

### 🤖 AI + Voice
- Gemini → OpenAI fallback
- Context-aware responses
- Speech recognition input
- ElevenLabs voice output + browser fallback

### 🎙️ Voice Mode
- `/voice-agent` interface
- Real-time conversation UI
- Intent detection
- Voice commands (open GitHub, LinkedIn)

### 🎨 UI / UX
- Responsive design
- Framer Motion animations
- Three.js 3D visuals

### 📬 Backend
- Contact form (Resend API)
- Rate limiting
- Secure APIs

---

## 🛠 Tech Stack

| Category | Tech |
|--------|------|
| Framework | Next.js 15 |
| Language | TypeScript |
| UI | React 19, Tailwind CSS |
| 3D | Three.js |
| AI | Gemini API, OpenAI API |
| Voice | Speech Recognition |
| TTS | ElevenLabs |
| Email | Resend |

---

## 📊 GitHub Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=harshanaCoder&show_icons=true&theme=tokyonight&hide_border=true" height="160"/>
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=harshanaCoder&theme=tokyonight&hide_border=true" height="160"/>
</p>

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=harshanaCoder&layout=compact&theme=tokyonight&hide_border=true"/>
</p>

<!-- ---

## 🎥 Project Preview

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/demo.gif" width="800"/>
</p> -->

---

## ⚡ Contribution Graph

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=harshanaCoder&theme=tokyo-night&hide_border=true"/>
</p>

---

## 🧠 System Flow

```mermaid
flowchart LR
A[User 🎤/⌨️] --> B[Speech Recognition]
B --> C[/api/ai]
C --> D[AI Processing]
D --> E[Response]
E --> F[TTS 🔊]
````

---

## 📂 Project Structure

```bash
app/
  api/
    ai/
    assistant/
    tts/
    contact/

  page.tsx
  voice-agent/

components/
  voice/
  scene/
  interactive/

lib/
  mainData.ts
  assistantPrompts.ts
  voiceAssistantData.ts
```

---

## ⚡ Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

```env
GEMINI_API_KEY=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
RESEND_API_KEY=
```

---

## 🔌 API Endpoints

### `/api/ai`

```json
{
  "message": "Tell me about your projects",
  "intent": "projects"
}
```

### `/api/assistant`

```json
{
  "prompt": "Explain architecture",
  "projectSlug": "ai-agent-portfolio-platform"
}
```

### `/api/tts`

```json
{ "text": "Hello world" }
```

### `/api/contact`

```json
{
  "name": "John",
  "email": "john@example.com",
  "message": "Let's collaborate"
}
```

---

## 🎯 Customization

Edit:

* lib/mainData.ts
* projects.ts
* credentials.ts
* voiceMode/*

Assets:

```
public/
  projectThumbnails/
  credentialImages/
  3dModel/
```

---

## 🚀 Deployment

```bash
npm run build
npm start
```

---

## 🧪 Troubleshooting

| Problem         | Solution         |
| --------------- | ---------------- |
| Mic not working | Enable HTTPS     |
| No AI           | Check API keys   |
| No voice        | Check ElevenLabs |
| Email fails     | Verify Resend    |

---

## 🌐 Connect

<p align="center">
  <a href="https://github.com/harshanaCoder">
    <img src="https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github"/>
  </a>
  <a href="https://linkedin.com/in/YOUR_LINKEDIN">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin"/>
  </a>
</p>

---

## 🐍 Contribution Snake

<p align="center">
  <img src="https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake.svg" />
</p>

---

## 📜 License

No license specified yet.

Consider adding MIT License for open-source use.

---

## 👨‍💻 Author

Janith Harshana
AI • Robotics • Full-Stack Engineer


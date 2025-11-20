# AI Fitness Coach – Personalized Workout and Diet Generator

AI Fitness Coach is a modern application that generates customized workout routines, structured diet plans, and daily motivation guidance based on user input. The project is built with a modular architecture using Next.js, TailwindCSS, and a backend powered by AI models.

The application includes a clean user interface, fast performance, and supports exporting complete fitness plans as a PDF.

---

## Features

- Personalized fitness plan generation
- Seven-day workout schedule
- Seven-day diet plan based on dietary preferences
- Daily motivation and training tips
- PDF export with a clean, structured layout
- Optional AI-generated exercise images
- Text-to-speech audio support for summaries
- Fully responsive UI with dark mode

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TailwindCSS
- Framer Motion
- lucide-react icons

### Backend
- Custom API routes (`app/api`)
- Gemini AI for plan generation and text/audio/image processing

### Utilities
- jsPDF for PDF creation
- Custom prompt builder and formatter

---

## Project Structure

```
frontend/
│
├── app/
│   ├── api/
│   │   ├── generate-plan/
│   │   ├── image/
│   │   └── tts/
│   ├── components/
│   │   ├── forms/
│   │   ├── plan/
│   │   ├── media/
│   │   └── utils/pdf.js
│   ├── layout.js
│   └── page.js
│
├── backend/
│   ├── lib/
│   ├── services/
│   └── utils/
│
├── public/
├── .env.local
├── next.config.mjs
├── package.json
└── README.md
```

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-fitness-coach.git
cd ai-fitness-coach/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add environment variables  
Create a `.env.local` file:

```
GEMINI_API_KEY=your_api_key_here
```

### 4. Start development server
```bash
npm run dev
```

---

## Deployment (Vercel)

Vercel automatically detects the Next.js framework.

### Build Settings
| Setting | Value |
|--------|--------|
| Build Command | npm run build |
| Output Directory | .next |
| Install Command | npm install |
| Framework | Next.js |

### Environment Variables
```
GEMINI_API_KEY=your_api_key
```

---

## API Routes

### Generate fitness plan
```
POST /api/generate-plan
```

### Generate images
```
POST /api/image
```

### Text-to-speech audio
```
POST /api/tts
```

---

## PDF Export

The application includes a dedicated PDF generator:

- Clean layout  
- Structured sections  
- Automatic page breaks  
- Page numbers and footer  
- No decorative elements  

# SpeakLabs

AI-Powered Speech Feedback Platform built with Next.js, React, TypeScript, and FastAPI.

## 🚀 Features

- **Audio Recording**: Browser-based audio recording with real-time timer
- **AI Voice Interaction**: Interactive AI voice coach powered by ElevenLabs (placeholder)
- **Speech Analysis**: Emotion and engagement detection using Presage API (placeholder)
- **Feedback Dashboard**: Visual feedback with engagement scores and confidence levels
- **Structured Feedback**: Survey generation via SurveyMonkey API (placeholder)
- **Error Monitoring**: Full-stack error logging and performance monitoring with Sentry

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Components**:
  - `AudioRecorder`: Real-time audio recording with microphone access
  - `AIVoiceInterface`: AI voice coach interaction
  - `FeedbackDashboard`: Visual analytics and feedback display

### Backend (FastAPI + Python)
- **Framework**: FastAPI with async support
- **Key Endpoints**:
  - `POST /api/audio/upload`: Audio file upload
  - `POST /api/speech/analyze`: Speech analysis with Presage
  - `POST /api/voice/generate`: AI voice generation with ElevenLabs
  - `POST /api/feedback/generate`: Feedback survey creation with SurveyMonkey
  - `GET /api/feedback/{session_id}`: Retrieve feedback summary

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/richnguyenn/SpeakLabs.git
cd SpeakLabs
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

## 🔑 Environment Variables

### Backend (.env)
```bash
# Sentry Configuration
SENTRY_DSN=your_sentry_dsn_here

# Presage API (Emotion/Engagement Analysis)
PRESAGE_API_KEY=your_presage_api_key_here
PRESAGE_API_URL=https://api.presage.example.com

# ElevenLabs API (AI Voice Generation)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_API_URL=https://api.elevenlabs.io/v1

# SurveyMonkey API (Feedback Generation)
SURVEYMONKEY_API_KEY=your_surveymonkey_api_key_here
SURVEYMONKEY_API_URL=https://api.surveymonkey.com/v3
```

### Frontend (.env.local)
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# ElevenLabs API Key (if needed client-side)
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate
python main.py
```

Backend will run on http://localhost:8000

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

## 🧪 API Documentation

Once the backend is running, visit:
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## 📦 Integration Placeholders

This application includes placeholder integrations for:

### Presage API
- Emotion detection from speech
- Engagement score calculation
- Located in: `backend/main.py` - `analyze_speech()` endpoint

### ElevenLabs API
- AI voice generation
- Text-to-speech conversion
- Located in: `backend/main.py` - `generate_voice()` endpoint

### SurveyMonkey API
- Structured feedback survey generation
- Question generation based on analysis
- Located in: `backend/main.py` - `generate_feedback()` endpoint

### Sentry
- Error logging and tracking
- Performance monitoring
- Distributed tracing across frontend and backend

## 🔒 Security

- CORS configured for Next.js integration
- File upload validation
- Error handling with Sentry integration
- Environment variable configuration for sensitive data

## 🏃 Development Workflow

1. Make changes to frontend components in `frontend/components/`
2. Update backend endpoints in `backend/main.py`
3. Test locally with both servers running
4. Check Sentry for any errors or performance issues

## 📝 Project Structure

```
SpeakLabs/
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── AudioRecorder.tsx        # Audio recording component
│   │   ├── AIVoiceInterface.tsx     # AI voice coach component
│   │   └── FeedbackDashboard.tsx    # Feedback display component
│   ├── sentry.client.config.ts      # Sentry client config
│   ├── sentry.server.config.ts      # Sentry server config
│   └── package.json
├── backend/
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variables template
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Sentry for monitoring

**Backend:**
- FastAPI
- Python 3.8+
- Uvicorn
- Pydantic
- Sentry SDK

**Integrations (Placeholders):**
- Presage - Emotion/Engagement Analysis
- ElevenLabs - AI Voice Generation
- SurveyMonkey - Feedback Surveys

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions, please open an issue on GitHub.
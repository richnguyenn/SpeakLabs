import os
from typing import Optional
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from dotenv import load_dotenv

load_dotenv()

# Initialize Sentry for error logging and performance monitoring
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN", ""),
    integrations=[FastApiIntegration()],
    traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
    profiles_sample_rate=float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0.1")),
    enable_tracing=True,
    # Add data like request headers and IP for users
    send_default_pii=True,
)

app = FastAPI(title="SpeakLabs API", version="1.0.0")

# Configure CORS for Next.js integration
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class SpeechAnalysisRequest(BaseModel):
    audio_url: str
    text: Optional[str] = None

class SpeechAnalysisResponse(BaseModel):
    emotion: str
    engagement_score: float
    confidence: float
    analysis: str

class AIVoiceRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "default"

class AIVoiceResponse(BaseModel):
    audio_url: str
    duration: float

class FeedbackRequest(BaseModel):
    session_id: str
    analysis_data: dict

class FeedbackResponse(BaseModel):
    survey_id: str
    feedback_url: str
    questions: list

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to SpeakLabs API", "version": "1.0.0"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Sentry test endpoint - Remove after verification
@app.get("/sentry-debug")
async def trigger_error():
    """Test endpoint to verify Sentry is working"""
    division_by_zero = 1 / 0

# Audio upload endpoint
@app.post("/api/audio/upload")
async def upload_audio(file: UploadFile = File(...)):
    """
    Upload audio file for processing.
    In production, this would save to cloud storage.
    """
    try:
        # Validate file type
        if not file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Read file content
        content = await file.read()
        
        # TODO: Save to cloud storage (S3, GCS, etc.)
        # For now, return a placeholder URL
        audio_url = f"https://storage.example.com/audio/{file.filename}"
        
        return {
            "success": True,
            "audio_url": audio_url,
            "filename": file.filename,
            "size": len(content)
        }
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=str(e))

# Speech analysis endpoint with Presage integration (placeholder)
@app.post("/api/speech/analyze", response_model=SpeechAnalysisResponse)
async def analyze_speech(request: SpeechAnalysisRequest):
    """
    Analyze speech for emotion and engagement using Presage API.
    This is a placeholder implementation.
    """
    try:
        # TODO: Integrate with Presage API for actual emotion/engagement analysis
        # Placeholder response
        return SpeechAnalysisResponse(
            emotion="confident",
            engagement_score=0.85,
            confidence=0.92,
            analysis="The speaker demonstrates strong confidence and high engagement. "
                     "Voice tone is clear with appropriate pacing. "
                     "Areas for improvement: occasional filler words."
        )
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=str(e))

# AI voice generation endpoint with ElevenLabs integration (placeholder)
@app.post("/api/voice/generate", response_model=AIVoiceResponse)
async def generate_voice(request: AIVoiceRequest):
    """
    Generate AI voice response using ElevenLabs API.
    This is a placeholder implementation.
    """
    try:
        # TODO: Integrate with ElevenLabs API for actual voice generation
        # Placeholder response
        return AIVoiceResponse(
            audio_url=f"https://voice.example.com/generated/audio_{request.voice_id}.mp3",
            duration=len(request.text) * 0.1  # Rough estimation
        )
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=str(e))

# Feedback generation endpoint with SurveyMonkey API integration (placeholder)
@app.post("/api/feedback/generate", response_model=FeedbackResponse)
async def generate_feedback(request: FeedbackRequest):
    """
    Generate structured feedback using SurveyMonkey API.
    This is a placeholder implementation.
    """
    try:
        # TODO: Integrate with SurveyMonkey API for actual survey generation
        # Placeholder response
        return FeedbackResponse(
            survey_id=f"survey_{request.session_id}",
            feedback_url=f"https://surveymonkey.com/r/feedback_{request.session_id}",
            questions=[
                "How would you rate your overall speaking confidence?",
                "What aspects of your speech would you like to improve?",
                "Did you find the AI feedback helpful?",
                "Rate your engagement during the session (1-10)"
            ]
        )
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=str(e))

# Get feedback summary
@app.get("/api/feedback/{session_id}")
async def get_feedback(session_id: str):
    """
    Retrieve feedback summary for a session.
    """
    try:
        # TODO: Retrieve from database
        # Placeholder response
        return {
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "emotion": "confident",
            "engagement_score": 0.85,
            "feedback_points": [
                "Clear articulation and good pacing",
                "Strong emotional engagement",
                "Consider reducing filler words",
                "Maintain consistent tone"
            ],
            "improvement_areas": [
                "Filler words reduction",
                "Pause management"
            ]
        }
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

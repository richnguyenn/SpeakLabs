'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import AudioRecorder from '@/components/AudioRecorder';
import AIVoiceInterface from '@/components/AIVoiceInterface';
import FeedbackDashboard from '@/components/FeedbackDashboard';

interface SpeechAnalysis {
  emotion: string;
  engagement_score: number;
  confidence: number;
  analysis: string;
}

export default function Home() {
  const [analysis, setAnalysis] = useState<SpeechAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionId] = useState<string>(() => `session_${Date.now()}`);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Upload audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audio/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload audio');
      }

      const uploadData = await uploadResponse.json();

      // Analyze speech
      const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/speech/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: uploadData.audio_url,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze speech');
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);

      // Generate feedback survey (placeholder)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          analysis_data: analysisData,
        }),
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      Sentry.captureException(error);
      alert('Failed to process recording. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎤 SpeakLabs
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Speech Feedback Platform
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Session ID: {sessionId}
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            <AIVoiceInterface sessionId={sessionId} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <FeedbackDashboard analysis={analysis} isLoading={isAnalyzing} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Integrated with Presage (Emotion Analysis) • ElevenLabs (AI Voice) • SurveyMonkey (Feedback) • Sentry (Monitoring)
          </p>
        </footer>
      </div>
    </div>
  );
}

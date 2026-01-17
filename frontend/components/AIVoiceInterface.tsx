'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

interface AIVoiceInterfaceProps {
  sessionId?: string;
}

export default function AIVoiceInterface({ sessionId }: AIVoiceInterfaceProps) {
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAIResponse = async (prompt: string) => {
    setIsGenerating(true);
    setAiMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voice/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
          voice_id: 'default',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI response');
      }

      const data = await response.json();
      setAudioUrl(data.audio_url);
      setAiMessage(prompt);
    } catch (error) {
      console.error('Error generating AI response:', error);
      Sentry.captureException(error);
      alert('Failed to generate AI response');
    } finally {
      setIsGenerating(false);
    }
  };

  const predefinedQuestions = [
    "Tell me about your presentation goals.",
    "What challenges do you face when speaking?",
    "How do you feel about your current speaking skills?",
    "What would you like to improve most?"
  ];

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">AI Voice Coach</h2>
      
      <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg">
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-gray-600">AI is thinking...</span>
          </div>
        ) : aiMessage ? (
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">{aiMessage}</p>
            {audioUrl && (
              <div className="text-xs text-gray-500">
                🔊 Voice response generated (placeholder: {audioUrl})
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select a question below to hear from your AI voice coach</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">Quick Questions:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {predefinedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => generateAIResponse(question)}
              disabled={isGenerating}
              className="p-3 text-sm text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Powered by ElevenLabs (Placeholder Integration)
      </div>
    </div>
  );
}

'use client';

interface SpeechAnalysis {
  emotion: string;
  engagement_score: number;
  confidence: number;
  analysis: string;
}

interface FeedbackDashboardProps {
  analysis: SpeechAnalysis | null;
  isLoading: boolean;
}

export default function FeedbackDashboard({ analysis, isLoading }: FeedbackDashboardProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-center text-gray-600">Analyzing your speech...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        <p className="text-gray-600 text-center py-8">
          Record your speech to receive AI-powered feedback
        </p>
      </div>
    );
  }

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      confident: 'bg-green-100 text-green-800',
      nervous: 'bg-yellow-100 text-yellow-800',
      excited: 'bg-blue-100 text-blue-800',
      calm: 'bg-purple-100 text-purple-800',
      default: 'bg-gray-100 text-gray-800',
    };
    return colors[emotion.toLowerCase()] || colors.default;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
      
      {/* Emotion and Engagement Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">Detected Emotion</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(analysis.emotion)}`}>
            {analysis.emotion.charAt(0).toUpperCase() + analysis.emotion.slice(1)}
          </span>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">Engagement Score</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${analysis.engagement_score * 100}%` }}
              />
            </div>
            <span className={`text-lg font-semibold ${getScoreColor(analysis.engagement_score)}`}>
              {(analysis.engagement_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">Confidence Level</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 transition-all"
                style={{ width: `${analysis.confidence * 100}%` }}
              />
            </div>
            <span className={`text-lg font-semibold ${getScoreColor(analysis.confidence)}`}>
              {(analysis.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800">Detailed Feedback</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{analysis.analysis}</p>
        </div>
      </div>

      {/* Integration Tags */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="px-2 py-1 bg-purple-50 rounded">
          📊 Presage Emotion Analysis
        </span>
        <span className="px-2 py-1 bg-blue-50 rounded">
          🎯 Engagement Detection
        </span>
        <span className="px-2 py-1 bg-green-50 rounded">
          📋 SurveyMonkey Feedback
        </span>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SentimentAnalysis } from '@/utils/sentimentAnalysis';

interface SentimentDisplayProps {
  analysis: SentimentAnalysis;
  visible?: boolean;
}

export const SentimentDisplay = ({ 
  analysis, 
  visible = false 
}: SentimentDisplayProps) => {
  if (!visible) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'very-negative': return 'bg-red-500';
      case 'negative': return 'bg-orange-500';
      case 'neutral': return 'bg-gray-500';
      case 'positive': return 'bg-green-500';
      case 'very-positive': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'angry': return 'bg-red-600';
      case 'frustrated': return 'bg-orange-600';
      case 'worried': return 'bg-yellow-600';
      case 'sad': return 'bg-blue-600';
      case 'neutral': return 'bg-gray-600';
      case 'hopeful': return 'bg-indigo-600';
      case 'satisfied': return 'bg-green-600';
      case 'happy': return 'bg-emerald-600';
      default: return 'bg-gray-600';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-700';
      case 'high': return 'bg-orange-700';
      case 'medium': return 'bg-yellow-700';
      case 'low': return 'bg-green-700';
      default: return 'bg-gray-700';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/30 max-w-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-blue-700">
          🧠 Sentiment Analysis (Demo)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Sentiment:</span>
          <Badge className={`${getSentimentColor(analysis.sentiment)} text-white text-xs`}>
            {analysis.sentiment}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Emotion:</span>
          <Badge className={`${getEmotionColor(analysis.emotion)} text-white text-xs`}>
            {analysis.emotion}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Urgency:</span>
          <Badge className={`${getUrgencyColor(analysis.urgency)} text-white text-xs`}>
            {analysis.urgency}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Tone:</span>
          <Badge variant="outline" className="text-xs">
            {analysis.tone}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Confidence:</span>
          <span className="text-xs text-gray-600">
            {Math.round(analysis.confidence * 100)}%
          </span>
        </div>
        
        {analysis.keywords.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium">Key indicators:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.keywords.slice(0, 3).map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

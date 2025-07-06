export type SentimentLevel = 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
export type EmotionalState = 'frustrated' | 'angry' | 'worried' | 'sad' | 'neutral' | 'hopeful' | 'satisfied' | 'happy';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface SentimentAnalysis {
  sentiment: SentimentLevel;
  emotion: EmotionalState;
  urgency: UrgencyLevel;
  confidence: number;
  keywords: string[];
  tone: 'formal' | 'casual' | 'distressed' | 'polite' | 'demanding';
}

/**
 * Analyzes the sentiment and emotional state of user input
 * Uses keyword-based analysis with contextual understanding
 */
export const analyzeSentiment = (userInput: string): SentimentAnalysis => {
  const text = userInput.toLowerCase().trim();
  
  // Define keyword patterns for different emotional states
  const patterns = {
    // Frustration and anger indicators
    frustrated: [
      'frustrated', 'annoyed', 'irritated', 'fed up', 'sick of', 'tired of',
      'ridiculous', 'unacceptable', 'pathetic', 'terrible', 'awful', 'horrible',
      'waste of time', 'useless', 'incompetent', 'disappointed'
    ],
    angry: [
      'angry', 'furious', 'outraged', 'mad', 'pissed', 'livid', 'enraged',
      'disgusted', 'appalled', 'this is bs', 'bullshit', 'scam', 'fraud',
      'sue', 'lawsuit', 'complaint', 'report you'
    ],
    worried: [
      'worried', 'concerned', 'anxious', 'nervous', 'scared', 'afraid',
      'panicking', 'stressed', 'urgent', 'emergency', 'asap', 'immediately',
      'what if', 'hope not', 'please help'
    ],
    sad: [
      'sad', 'disappointed', 'heartbroken', 'devastated', 'upset', 'crying',
      'depressed', 'miserable', 'ruined', 'lost hope', 'give up'
    ],
    hopeful: [
      'hope', 'hopefully', 'fingers crossed', 'optimistic', 'confident',
      'looking forward', 'excited', 'can\'t wait'
    ],
    satisfied: [
      'satisfied', 'content', 'okay', 'fine', 'acceptable', 'reasonable',
      'good enough', 'works for me'
    ],
    happy: [
      'happy', 'great', 'excellent', 'fantastic', 'wonderful', 'amazing',
      'perfect', 'love', 'thrilled', 'delighted', 'pleased', 'thank you so much'
    ]
  };

  // Urgency indicators
  const urgencyKeywords = {
    urgent: ['urgent', 'emergency', 'asap', 'immediately', 'right now', 'critical'],
    high: ['soon', 'quickly', 'fast', 'hurry', 'rush', 'time sensitive', 'deadline'],
    medium: ['when', 'how long', 'timeline', 'schedule', 'plan'],
    low: ['eventually', 'whenever', 'no rush', 'take your time']
  };

  // Politeness indicators
  const politeKeywords = ['please', 'thank you', 'thanks', 'appreciate', 'grateful', 'kindly', 'if possible'];
  const demandingKeywords = ['need', 'want', 'must', 'have to', 'require', 'demand', 'insist', 'should'];
  const casualKeywords = ['hey', 'hi', 'yo', 'sup', 'yeah', 'yep', 'nah', 'gonna', 'wanna'];

  // Count matches for each emotion
  const emotionScores = Object.entries(patterns).map(([emotion, keywords]) => ({
    emotion: emotion as EmotionalState,
    score: keywords.filter(keyword => text.includes(keyword)).length,
    matchedKeywords: keywords.filter(keyword => text.includes(keyword))
  }));

  // Determine primary emotion
  const topEmotion = emotionScores.reduce((prev, current) => 
    current.score > prev.score ? current : prev
  );

  // Determine urgency
  let urgency: UrgencyLevel = 'low';
  let urgencyScore = 0;
  
  Object.entries(urgencyKeywords).forEach(([level, keywords]) => {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > urgencyScore) {
      urgencyScore = matches;
      urgency = level as UrgencyLevel;
    }
  });

  // Determine tone
  let tone: 'formal' | 'casual' | 'distressed' | 'polite' | 'demanding' = 'neutral' as any;
  const politeCount = politeKeywords.filter(keyword => text.includes(keyword)).length;
  const demandingCount = demandingKeywords.filter(keyword => text.includes(keyword)).length;
  const casualCount = casualKeywords.filter(keyword => text.includes(keyword)).length;

  if (topEmotion.emotion === 'angry' || topEmotion.emotion === 'frustrated') {
    tone = 'distressed';
  } else if (politeCount > 0) {
    tone = 'polite';
  } else if (demandingCount > politeCount && demandingCount > 1) {
    tone = 'demanding';
  } else if (casualCount > 0) {
    tone = 'casual';
  } else {
    tone = 'formal';
  }

  // Map emotion to sentiment
  const emotionToSentiment: Record<EmotionalState, SentimentLevel> = {
    angry: 'very-negative',
    frustrated: 'negative',
    worried: 'negative',
    sad: 'negative',
    neutral: 'neutral',
    hopeful: 'positive',
    satisfied: 'positive',
    happy: 'very-positive'
  };

  const emotion = topEmotion.score > 0 ? topEmotion.emotion : 'neutral';
  const sentiment = emotionToSentiment[emotion];
  
  // Calculate confidence based on keyword matches and text length
  const totalMatches = emotionScores.reduce((sum, item) => sum + item.score, 0);
  const confidence = Math.min(0.9, Math.max(0.3, totalMatches / Math.max(1, text.split(' ').length * 0.1)));

  return {
    sentiment,
    emotion,
    urgency,
    confidence,
    keywords: topEmotion.matchedKeywords,
    tone
  };
};

/**
 * Generates empathetic response starters based on sentiment analysis
 */
export const getEmpatheticOpener = (analysis: SentimentAnalysis): string => {
  const { emotion, urgency, tone } = analysis;

  // High urgency situations
  if (urgency === 'urgent' || urgency === 'high') {
    if (emotion === 'worried' || emotion === 'frustrated') {
      return "I understand this is urgent and you're concerned. Let me help you right away.";
    }
    return "I can see this needs immediate attention. Let me prioritize this for you.";
  }

  // Emotional state responses
  switch (emotion) {
    case 'angry':
      return "I completely understand your frustration, and I sincerely apologize for the inconvenience you've experienced.";
    
    case 'frustrated':
      return "I can hear how frustrating this situation must be for you, and I'm here to help make this right.";
    
    case 'worried':
      return "I understand your concern, and I want to reassure you that we'll work together to resolve this.";
    
    case 'sad':
      return "I'm really sorry to hear about this situation. Let me see how I can help turn this around for you.";
    
    case 'happy':
      return tone === 'casual' ? "I'm so glad to hear that! How can I help make your day even better?" 
                                : "It's wonderful to hear from you! How may I assist you today?";
    
    case 'satisfied':
      return "I'm pleased you're having a good experience. What can I help you with?";
    
    case 'hopeful':
      return "I appreciate your positive outlook! Let me do my best to help you.";
    
    default:
      return tone === 'polite' ? "Thank you for reaching out. I'm here to help you with whatever you need."
                               : tone === 'casual' ? "Hey there! What can I help you with today?"
                               : "Hello! I'm here to assist you.";
  }
};

/**
 * Adjusts the tone of a response based on sentiment analysis
 */
export const adjustResponseTone = (baseResponse: string, analysis: SentimentAnalysis): string => {
  const { emotion, tone, urgency } = analysis;

  // Add empathetic elements based on emotion
  let adjustedResponse = baseResponse;

  // Make language more empathetic for negative emotions
  if (emotion === 'angry' || emotion === 'frustrated') {
    adjustedResponse = adjustedResponse
      .replace(/We will/g, "I'll personally ensure we")
      .replace(/The refund will/g, "Your refund will")
      .replace(/You'll receive/g, "You should receive")
      .replace(/5-7 business days/g, "5-7 business days (I'll monitor this for you)");
  }

  // Add urgency indicators
  if (urgency === 'urgent' || urgency === 'high') {
    adjustedResponse = adjustedResponse
      .replace(/will be processed/g, "will be expedited and processed")
      .replace(/5-7 business days/g, "3-5 business days (expedited processing)");
  }

  // Adjust formality based on tone
  if (tone === 'casual') {
    adjustedResponse = adjustedResponse
      .replace(/I am /g, "I'm ")
      .replace(/You will /g, "You'll ")
      .replace(/We will /g, "We'll ")
      .replace(/regarding this refund/g, "about your refund");
  }

  return adjustedResponse;
};

let initialized = false;
const criteria = [
  "task_achievement",
  "coherence_cohesion",
  "lexical_resource",
  "grammatical_range_accuracy",
];

// Initialize service
export const initialize = async () => {
  if (initialized) return;

  console.log("Initializing ScoringPipelineService...");
  // Add initialization logic here (API keys, models, etc.)
  initialized = true;
};

// Score writing text
export const scoreWriting = async (
  text,
  taskType = "general",
  useDetailedFeedback = false
) => {
  await initialize();

  console.log(`Scoring text (${text.length} chars) for task type: ${taskType}`);

  // Simple scoring algorithm (replace with actual AI implementation)
  const scores = calculateScores(text);

  const result = {
    overall_score: calculateOverallScore(scores),
    criteria_scores: scores,
    task_type: taskType,
    text_length: text.length,
    detailed_feedback: {},
    timestamp: new Date().toISOString(),
  };

  if (useDetailedFeedback) {
    result.detailed_feedback = generateDetailedFeedback(text, scores);
  }

  return result;
};

// Calculate scores for each criterion
const calculateScores = (text) => {
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentenceCount;

  // Simple scoring based on text characteristics
  const taskAchievement = Math.min(
    9,
    Math.max(
      1,
      wordCount >= 150 ? 7 + Math.random() * 2 : 4 + Math.random() * 3
    )
  );

  const coherenceCohesion = Math.min(
    9,
    Math.max(
      1,
      avgWordsPerSentence > 10 && avgWordsPerSentence < 25
        ? 6 + Math.random() * 3
        : 4 + Math.random() * 3
    )
  );

  const lexicalResource = Math.min(
    9,
    Math.max(1, calculateLexicalDiversity(text) * 9)
  );

  const grammaticalRange = Math.min(
    9,
    Math.max(1, calculateGrammaticalComplexity(text) * 9)
  );

  return {
    task_achievement: Math.round(taskAchievement * 10) / 10,
    coherence_cohesion: Math.round(coherenceCohesion * 10) / 10,
    lexical_resource: Math.round(lexicalResource * 10) / 10,
    grammatical_range_accuracy: Math.round(grammaticalRange * 10) / 10,
  };
};

// Calculate overall score
const calculateOverallScore = (scores) => {
  const values = Object.values(scores);
  const average = values.reduce((sum, score) => sum + score, 0) / values.length;
  return Math.round(average * 10) / 10;
};

// Calculate lexical diversity (simple implementation)
const calculateLexicalDiversity = (text) => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  return Math.min(1, (uniqueWords.size / words.length) * 2);
};

// Calculate grammatical complexity (simple implementation)
const calculateGrammaticalComplexity = (text) => {
  // Simple heuristics for grammatical complexity
  const complexStructures = [
    /\b(although|however|nevertheless|furthermore|moreover)\b/gi,
    /\b(if|when|while|because|since)\b/gi,
    /\b(which|that|who|whom|whose)\b/gi,
  ];

  let complexityScore = 0.3; // Base score

  complexStructures.forEach((pattern) => {
    const matches = text.match(pattern) || [];
    complexityScore += matches.length * 0.1;
  });

  return Math.min(1, complexityScore);
};

// Generate detailed feedback
const generateDetailedFeedback = (text, scores) => {
  const wordCount = text.split(/\s+/).length;

  return {
    task_achievement: {
      score: scores.task_achievement,
      feedback:
        wordCount >= 150
          ? "Good task achievement with adequate length and content."
          : "Consider expanding your response to fully address the task requirements.",
    },
    coherence_cohesion: {
      score: scores.coherence_cohesion,
      feedback:
        scores.coherence_cohesion >= 6
          ? "Good coherence and cohesion with clear logical flow."
          : "Work on improving paragraph structure and linking words for better coherence.",
    },
    lexical_resource: {
      score: scores.lexical_resource,
      feedback:
        scores.lexical_resource >= 6
          ? "Good vocabulary range and usage."
          : "Try to use more varied vocabulary and avoid repetition.",
    },
    grammatical_range_accuracy: {
      score: scores.grammatical_range_accuracy,
      feedback:
        scores.grammatical_range_accuracy >= 6
          ? "Good grammatical range and accuracy."
          : "Focus on using more complex sentence structures and improving accuracy.",
    },
    overall_comments: [
      `Text length: ${wordCount} words`,
      wordCount < 150
        ? "Consider writing more to fully develop your ideas."
        : "Good length for comprehensive response.",
      "Continue practicing to improve your writing skills.",
    ],
  };
};

// Get scoring criteria
export const getScoringCriteria = async () => {
  return {
    criteria: criteria,
    descriptions: {
      task_achievement: "How well the response addresses the task requirements",
      coherence_cohesion: "Logical organization and flow of ideas",
      lexical_resource: "Vocabulary range and accuracy",
      grammatical_range_accuracy: "Grammar complexity and correctness",
    },
    score_ranges: {
      "1-3": "Limited proficiency",
      "4-5": "Modest proficiency",
      "6-7": "Competent proficiency",
      "8-9": "Very good to excellent proficiency",
    },
  };
};

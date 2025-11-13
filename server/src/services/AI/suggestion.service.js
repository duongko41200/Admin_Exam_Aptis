import { initialize as initializeGemini } from "../config/gemini.js";
import { logger } from "../config/logger.js";
import * as retrievalService from "./retrieval.service.js";

/**
 * Generate comprehensive suggestions for a writing
 * Implements Flow D from API_FLOW_GUIDE.md
 */
export const generateSuggestions = async (
  userId,
  type,
  currentWriting,
  similarWritings = []
) => {
  try {
    // const geminiModel = await initialize();

    // Generate form suggestions
    const formSuggestions = await generateFormSuggestions(
      currentWriting,
      similarWritings
    );

    // Generate solution reuse patterns
    const solutionReuse = await generateSolutionReuse(
      currentWriting,
      similarWritings
    );

    // Generate personalized recommendations
    const recommendations = await generateRecommendations(
      currentWriting,
      similarWritings
    );

    const suggestions = {
      formSuggestions,
      solutionReuse,
      recommendations,
    };

    logger.info("Suggestions generated successfully", {
      userId,
      formSuggestionsCount: formSuggestions.length,
      solutionReuseCount: solutionReuse.length,
      recommendationsCount: recommendations.length,
    });

    return suggestions;
  } catch (error) {
    logger.error("Error generating suggestions", error);
    throw new Error(`Failed to generate suggestions: ${error.message}`);
  }
};

/**
 * Get form suggestions for a specific user and type
 */
export const getFormSuggestions = async (userId, type, context) => {
  try {
    await initialize();

    // Get user's successful writings for pattern analysis
    const successfulWritings = await getSuccessfulWritings(userId, type);

    if (successfulWritings.length === 0) {
      return getDefaultFormSuggestions(type);
    }

    // Extract patterns from successful writings
    const patterns = await extractPatterns(successfulWritings);

    // Generate contextualized suggestions
    const suggestions = await rankSuggestions(patterns, context, type);

    return {
      userId,
      type,
      suggestions,
      personalized_recommendations:
        generatePersonalizedRecommendations(patterns),
    };
  } catch (error) {
    logger.error("Error getting form suggestions", error);
    throw new Error(`Failed to get form suggestions: ${error.message}`);
  }
};

/**
 * Analyze writing patterns for effectiveness
 */
export const analyzeWritingPatterns = async (params) => {
  const { userId, type, timeframe } = params;

  try {
    // This would query actual database in production
    const mockPatterns = {
      patterns_found: [
        {
          pattern_id: "formal_letter_opening",
          pattern_name: "Formal Letter Opening",
          pattern_type: "structural",
          usage_frequency: 0.8,
          effectiveness_score: 8.5,
          success_rate: 0.92,
          avg_score_improvement: 0.7,
          applicable_contexts: [
            "business letter",
            "formal email",
            "complaint letter",
          ],
          examples: [
            {
              writing_id: "example_1",
              excerpt: "Dear Sir/Madam, I am writing to...",
              score: 8.2,
            },
          ],
        },
      ],
      insights: [
        "Your formal letter openings show 92% success rate",
        "Consider using more varied vocabulary in essay introductions",
      ],
      recommendations: [
        "Continue leveraging your successful letter format",
        "Practice essay introduction variations",
      ],
    };

    return mockPatterns;
  } catch (error) {
    logger.error("Error analyzing writing patterns", error);
    throw error;
  }
};

/**
 * Get pattern effectiveness metrics
 */
export const getPatternEffectiveness = async (patternId) => {
  try {
    // Mock implementation - would query actual metrics in production
    const effectiveness = {
      pattern_id: patternId,
      overall_effectiveness: 8.5,
      usage_statistics: {
        total_uses: 45,
        successful_uses: 41,
        success_rate: 0.91,
      },
      score_impact: {
        avg_score_before: 6.8,
        avg_score_after: 7.5,
        improvement: 0.7,
      },
      user_feedback: {
        positive_feedback_ratio: 0.89,
        common_positive_themes: ["clarity", "structure", "professionalism"],
        improvement_suggestions: ["vocabulary variety", "sentence complexity"],
      },
      recommendations: [
        "Continue using this pattern for formal writing",
        "Experiment with vocabulary variations within this structure",
      ],
    };

    return effectiveness;
  } catch (error) {
    logger.error("Error getting pattern effectiveness", error);
    throw error;
  }
};

/**
 * Generate form suggestions based on current writing and similar writings
 */
const generateFormSuggestions = async (currentWriting, similarWritings) => {
  try {
    const contextPrompt = buildSuggestionPrompt(
      currentWriting,
      similarWritings
    );

    const prompt = `
Return ONLY a valid JSON array (no explanation, no markdown, no extra text).
Format:
[
{ "name": "...", "pattern": "...", "success_rate": ..., "usage_context": "..." },
...
]

Based on the writing analysis below, suggest 3-5 reusable form elements and structural patterns as described above.

${contextPrompt}

Focus on:

Structural templates
Effective opening/closing phrases
Transition patterns
Format-specific elements
Important:
Your response MUST be a valid JSON array. Do NOT include any explanation, markdown, or extra text.
`;

    const geminiModel = await initializeGemini();

    const result = await geminiModel.generateContent(prompt);

    const response = result.response.text();

    const convertTextByJson = JSON.parse(response);
    console.log({ convertTextByJson });
    return convertTextByJson;
  } catch (error) {
    logger.warn(
      "Failed to generate AI form suggestions, using fallbacks",
      error
    );
    return getDefaultFormSuggestions(currentWriting.type);
  }
};

/**
 * Generate solution reuse patterns
 */
const generateSolutionReuse = async (currentWriting, similarWritings) => {
  try {
    const prompt = `
Analyze this writing and identify reusable solution patterns:

Current Writing:
Type: ${currentWriting.type}
Content: ${currentWriting.content}
Scores: ${JSON.stringify(currentWriting.scores)}

Similar Successful Writings:
${similarWritings
  .map(
    (w) => `
Type: ${w.type}
Score: ${w.scores?.overall || "N/A"}
Excerpt: ${w.content.substring(0, 200)}...
`
  )
  .join("\n---\n")}

Identify patterns that can be reused across multiple writing tasks:
1. Versatile templates
2. Effective phrase patterns
3. Argument structures
4. Content organization methods

Important:
Return ONLY a valid JSON array with: pattern_name, template, versatility_score, applications.
Your response MUST be a valid JSON array. Do NOT include any explanation, markdown, or extra text. Do NOT use triple backticks or any introductory sentence.
`;

    const geminiModel = await initializeGemini();
    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text();
    const convertTextByJson = JSON.parse(response);
    console.log("solution reuse patterns generated: ", { convertTextByJson });
    return convertTextByJson;
  } catch (error) {
    logger.warn("Failed to generate solution reuse patterns", error);
    return getDefaultSolutionReuse(currentWriting.type);
  }
};

/**
 * Generate personalized recommendations
 */
const generateRecommendations = async (currentWriting, similarWritings) => {
  try {
    const prompt = `
Generate personalized writing improvement recommendations:

Current Writing Performance:
- Grammar: ${currentWriting.scores.grammar}/9
- Vocabulary: ${currentWriting.scores.vocabulary}/9  
- Coherence: ${currentWriting.scores.coherence}/9
- Task Fulfillment: ${currentWriting.scores.task_fulfillment}/9

Historical Context:
${
  similarWritings.length > 0
    ? `Previous writings show patterns in ${similarWritings
        .map((w) => w.type)
        .join(", ")}`
    : "First writing - establishing baseline"
}

Provide 3-5 specific, actionable recommendations for improvement.
Focus on the lowest-scoring areas and leverage identified strengths.

Important:
Return ONLY a valid JSON array with: recommendation.
Your response MUST be a valid JSON array. Do NOT include any explanation, markdown, or extra text. Do NOT use triple backticks or any introductory sentence.
`;
    const geminiModel = await initializeGemini();
    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text();
    const convertTextByJson = JSON.parse(response);
    console.log("recommendations generated: ", { convertTextByJson });

    return convertTextByJson;
  } catch (error) {
    console.error("AI response: ", response);
    logger.warn("Failed to generate AI recommendations", error);
    return getDefaultRecommendations(currentWriting);
  }
};

/**
 * Get successful writings for pattern analysis
 */
const getSuccessfulWritings = async (userId, type) => {
  try {
    const similarWritings = await retrievalService.searchSimilarWritings({
      userId,
      type,
      limit: 10,
    });

    // Filter for successful writings (score >= 7)
    return similarWritings.filter((writing) => writing.scores?.overall >= 7);
  } catch (error) {
    logger.warn("Failed to get successful writings", error);
    return [];
  }
};

/**
 * Extract patterns from successful writings using AI
 */
const extractPatterns = async (writings) => {
  try {
    const prompt = `
Analyze these successful writings and extract reusable patterns:

${writings
  .map(
    (w) => `
Type: ${w.type}
Score: ${w.scores?.overall}/9
Content: ${w.content}
`
  )
  .join("\n---\n")}

Extract:
1. Structural templates with success rates
2. Effective phrases and their contexts
3. Transition patterns
4. Format-specific successful elements

Return ONLY a valid JSON object with keys: structural_templates, reusable_phrases, transition_patterns, format_specific_elements.
Your response MUST be a valid JSON object. Do NOT include any explanation, markdown, or extra text. Do NOT use triple backticks or any introductory sentence.
`;

    const geminiModel = await initializeGemini();

    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text();
    const convertTextByJson = JSON.parse(response);
    console.log({ convertTextByJson });

    return convertTextByJson;
  } catch (error) {
    console.error("AI response: ", response);
    logger.warn("Failed to extract patterns with AI", error);
    return extractPatternsManually(writings);
  }
};

/**
 * Build suggestion prompt with context
 */
const buildSuggestionPrompt = (currentWriting, similarWritings) => {
  return `
CURRENT WRITING ANALYSIS:
Type: ${currentWriting.type}
Prompt: ${currentWriting.prompt}
Content Length: ${currentWriting.content.length} characters
Scores: 
- Grammar: ${currentWriting.scores.grammar}/9
- Vocabulary: ${currentWriting.scores.vocabulary}/9
- Coherence: ${currentWriting.scores.coherence}/9
- Task Fulfillment: ${currentWriting.scores.task_fulfillment}/9
- Overall: ${currentWriting.scores.overall}/9

SIMILAR WRITINGS CONTEXT:
${similarWritings
  .map(
    (w) => `
ID: ${w.id}
Type: ${w.type}
Score: ${w.scores?.overall || "N/A"}/9
Success Elements: ${w.successPatterns?.join(", ") || "N/A"}
Excerpt: ${w.content.substring(0, 150)}...
`
  )
  .join("\n---\n")}
`;
};

// Helper functions for parsing AI responses and providing fallbacks

const parseFormSuggestions = (response) => {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn("Failed to parse AI form suggestions", error);
  }

  return [];
};

const parseSolutionReuse = (response) => {
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    logger.warn("Failed to parse solution reuse", error);
  }

  return [];
};

const parseRecommendations = (response) => {
  try {
    // Extract recommendations from text response
    const lines = response
      .split("\n")
      .filter(
        (line) =>
          line.trim().length > 0 &&
          (line.includes("-") || line.includes("•") || line.match(/^\d+\./))
      );

    return lines.map((line) => line.replace(/^[-•\d.]\s*/, "").trim());
  } catch (error) {
    logger.warn("Failed to parse recommendations", error);
  }

  return [];
};

const parseExtractedPatterns = (response) => {
  // Fallback to manual pattern extraction if AI parsing fails
  return {
    structural_templates: [],
    reusable_phrases: [],
    content_patterns: [],
  };
};

const extractPatternsManually = (writings) => {
  // Simple manual pattern extraction as fallback
  const patterns = {
    structural_templates: [],
    reusable_phrases: [],
    content_patterns: [],
  };

  writings.forEach((writing) => {
    // Extract common openings
    if (writing.type === "letter" && writing.content.startsWith("Dear")) {
      patterns.reusable_phrases.push({
        context: "letter_opening",
        phrase: "Dear [Name],",
        usage_count: 1,
        avg_score_when_used: writing.scores?.overall || 7,
      });
    }
  });

  return patterns;
};

// Default suggestions when AI generation fails

const getDefaultFormSuggestions = (type) => {
  const suggestions = {
    letter: [
      {
        name: "formal_letter_structure",
        pattern: [
          "Dear [Name],",
          "Opening statement",
          "Main content",
          "Closing statement",
          "Best regards, [Your name]",
        ],
        success_rate: 0.85,
        usage_context: "Formal letters and emails",
      },
    ],
    essay: [
      {
        name: "basic_essay_structure",
        pattern: [
          "Introduction with thesis",
          "Body paragraph 1",
          "Body paragraph 2",
          "Conclusion",
        ],
        success_rate: 0.8,
        usage_context: "Opinion and argumentative essays",
      },
    ],
  };

  return suggestions[type] || [];
};

const getDefaultSolutionReuse = (type) => {
  return [
    {
      pattern_name: "transition_phrases",
      template: "Furthermore, ...; In addition, ...; On the other hand, ...",
      versatility_score: 0.9,
      applications: ["essays", "reports", "formal writing"],
    },
  ];
};

const getDefaultRecommendations = (writing) => {
  const recommendations = [];

  if (writing.scores.grammar < 6) {
    recommendations.push(
      "Focus on grammar practice, especially verb tenses and sentence structure"
    );
  }

  if (writing.scores.vocabulary < 6) {
    recommendations.push(
      "Expand vocabulary with synonyms and varied expressions"
    );
  }

  if (writing.scores.coherence < 6) {
    recommendations.push(
      "Use more connecting words and organize ideas in clear paragraphs"
    );
  }

  return recommendations;
};

const generatePersonalizedRecommendations = (patterns) => {
  return [
    "Continue practicing your successful writing patterns",
    "Experiment with new vocabulary while maintaining your strong structure",
    "Focus on areas that consistently score lower in your writings",
  ];
};

const rankSuggestions = (patterns, context, type) => {
  // Simple ranking based on pattern effectiveness
  return {
    structural_templates: patterns.structural_templates || [],
    reusable_phrases: patterns.reusable_phrases || [],
    content_patterns: patterns.content_patterns || [],
    anti_patterns: [], // Patterns to avoid
  };
};

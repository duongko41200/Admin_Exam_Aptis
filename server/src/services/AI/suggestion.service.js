import { initialize as initializeGemini } from "../../configs/gemini.js";
import * as retrievalService from "./retrieval.service.js";

/**
 * Retry utility with exponential backoff for Gemini API
 */
const retryWithBackoff = async (asyncFn, maxRetries = 5, baseDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      // Check if it's a retryable error
      const isRetryable =
        error.status === 503 || // Service Unavailable
        error.status === 429 || // Rate Limited
        error.message.includes("overloaded") ||
        error.message.includes("network") ||
        error.message.includes("Service Unavailable");

      if (!isRetryable || attempt === maxRetries) {
        console.warn(
          `⚠️ Gemini API failed after ${attempt} attempts:`,
          error.message
        );
        throw error;
      }

      // Longer exponential backoff for overloaded API
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 2000;
      console.log(
        `🔄 Retry Gemini attempt ${attempt}/${maxRetries} after ${delay.toFixed(
          0
        )}ms (API overloaded)...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Safe Gemini call with retry and fallback
 */
const safeGeminiCall = async (prompt, fallbackResponse = null) => {
  try {
    return await retryWithBackoff(
      async () => {
        const geminiModel = await initializeGemini();
        return await geminiModel.generateContent(prompt);
      },
      5, // Increased retries
      3000 // Longer base delay
    );
  } catch (error) {
    console.error(`❌ Gemini API completely failed: ${error.message}`);

    // Always use fallback when API is overloaded
    if (fallbackResponse) {
      console.log(`🛡️ Using fallback response due to API overload`);
      return { response: { text: () => JSON.stringify(fallbackResponse) } };
    }

    // If no fallback provided, create a generic one
    console.log(`🛡️ Creating emergency fallback response`);
    const emergencyFallback = {
      error: "API temporarily unavailable",
      message: "Service will retry automatically",
      fallback: true,
      timestamp: new Date().toISOString(),
    };

    return { response: { text: () => JSON.stringify(emergencyFallback) } };
  }
};

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

    return suggestions;
  } catch (error) {
    console.log("Error generating suggestions", error);
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
    console.log("Error getting form suggestions", error);
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
    console.log("Error analyzing writing patterns", error);
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
    console.log("Error getting pattern effectiveness", error);
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

    const fallbackResponse = {
      suggestions: [
        "Structure your writing with clear sections",
        "Use appropriate tone for the context",
        "Include proper opening and closing",
      ],
      confidence: 0.5,
      fallback: true,
      source: "default_suggestions",
    };

    const result = await safeGeminiCall(prompt, fallbackResponse);
    const response = result.response.text();

    const convertTextByJson = JSON.parse(response);

    if (!convertTextByJson.fallback) {
      console.log("✅ Form suggestions generated via Gemini AI");
    }

    console.log({ convertTextByJson });
    return convertTextByJson;
  } catch (error) {
    console.error("❌ Form suggestions fallback:", error.message);
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
Type: ${currentWriting.type || "N/A"}
Content: ${currentWriting.content || "No content"}
Scores: ${JSON.stringify(currentWriting.scores)}

Similar Successful Writings:
${similarWritings
  .map(
    (w) => `
Type: ${w.type}
Score: ${w.scores?.overall || "N/A"}
Excerpt: ${w.content?.substring(0, 200) || "No content available"}...
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

    const fallbackResponse = [
      {
        pattern_name: "structured_approach",
        template: "Introduction → Main points → Conclusion",
        versatility_score: 0.8,
        applications: ["emails", "reports", "essays"],
      },
      {
        pattern_name: "clear_communication",
        template: "State purpose → Provide details → Call to action",
        versatility_score: 0.9,
        applications: ["business_communication", "formal_requests"],
      },
    ];

    const result = await safeGeminiCall(prompt, fallbackResponse);
    const response = result.response.text();
    const convertTextByJson = JSON.parse(response);

    console.log("✅ Solution reuse patterns generated:", { convertTextByJson });
    return convertTextByJson;
  } catch (error) {
    console.error("❌ Solution reuse fallback:", error.message);
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
- Grammar: ${currentWriting.scores?.grammar || 0}/9
- Vocabulary: ${currentWriting.scores?.vocabulary || 0}/9  
- Coherence: ${currentWriting.scores?.coherence || 0}/9
- Task Fulfillment: ${currentWriting.scores?.task_fulfillment || 0}/9

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
    const fallbackRecommendations = [
      "Focus on improving your lowest-scoring writing criterion",
      "Practice writing regularly to build consistency",
      "Read examples of high-quality writing in your target style",
      "Use varied sentence structures to improve flow",
      "Proofread carefully for grammar and spelling errors",
    ];

    const result = await safeGeminiCall(prompt, fallbackRecommendations);
    const response = result.response.text();
    const convertTextByJson = JSON.parse(response);

    console.log("✅ AI recommendations generated:", { convertTextByJson });
    return convertTextByJson;
  } catch (error) {
    console.error("❌ Failed to generate AI recommendations:", error.message);
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
    console.log("Failed to get successful writings", error);
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

    const fallbackPatterns = {
      structural_patterns: [
        { pattern: "clear_structure", frequency: 1.0, effectiveness: 0.7 },
      ],
      linguistic_patterns: [
        { pattern: "formal_tone", frequency: 0.8, effectiveness: 0.8 },
      ],
      success_factors: ["clarity", "organization", "appropriateness"],
    };

    const result = await safeGeminiCall(prompt, fallbackPatterns);
    const response = result.response.text();
    const convertTextByJson = JSON.parse(response);

    console.log("✅ Patterns extracted:", { convertTextByJson });
    return convertTextByJson;
  } catch (error) {
    console.error("❌ Failed to extract patterns with AI:", error.message);
    return extractPatternsManually(writings);
  }
};

/**
 * Build suggestion prompt with context
 */
const buildSuggestionPrompt = (currentWriting, similarWritings) => {
  return `
CURRENT WRITING ANALYSIS:
Type: ${currentWriting.type || "N/A"}
Prompt: ${currentWriting.prompt || "No prompt"}
Content Length: ${currentWriting.content?.length || 0} characters
Scores: 
- Grammar: ${currentWriting.scores?.grammar || 0}/9
- Vocabulary: ${currentWriting.scores?.vocabulary || 0}/9
- Coherence: ${currentWriting.scores?.coherence || 0}/9
- Task Fulfillment: ${currentWriting.scores?.task_fulfillment || 0}/9
- Overall: ${currentWriting.scores?.overall || 0}/9

SIMILAR WRITINGS CONTEXT:
${similarWritings
  .map(
    (w) => `
ID: ${w.id || "N/A"}
Type: ${w.type || "N/A"}
Score: ${w.scores?.overall || "N/A"}/9
Success Elements: ${w.successPatterns?.join(", ") || "N/A"}
Excerpt: ${w.content?.substring(0, 150) || "No content available"}...
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
    console.log("Failed to parse AI form suggestions", error);
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
    console.log("Failed to parse solution reuse", error);
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
    console.log("Failed to parse recommendations", error);
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

  if ((writing?.scores?.grammar || 0) < 6) {
    recommendations.push(
      "Focus on grammar practice, especially verb tenses and sentence structure"
    );
  }

  if ((writing?.scores?.vocabulary || 0) < 6) {
    recommendations.push(
      "Expand vocabulary with synonyms and varied expressions"
    );
  }

  if ((writing?.scores?.coherence || 0) < 6) {
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

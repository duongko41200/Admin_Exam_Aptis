import { z } from "zod";

// Writing submission schema
export const WritingSubmissionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  writingId: z.string().min(1, "Writing ID is required"),
  prompt: z.string().min(1, "Writing prompt is required"),
  content: z.string().min(50, "Writing content must be at least 50 characters"),
  submittedAt: z.string().optional(),
  part: z.number().optional(),
  metadata: z
    .object({
      taskId: z.string().optional(),
      submittedAt: z.string().optional(),
      timeLimit: z.number().optional(),
      wordLimit: z.number().optional(),
      typeEmail: z.number().optional(),
    })
    .optional(),
});

// Writing entity schema
export const WritingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  prompt: z.string(),
  type: z.enum(["letter", "essay", "report", "email", "general"]),
  content: z.string(),
  scores: z.object({
    grammar: z.number().min(0).max(9),
    vocabulary: z.number().min(0).max(9),
    coherence: z.number().min(0).max(9),
    task_fulfillment: z.number().min(0).max(9),
    overall: z.number().min(0).max(9),
  }),
  detailedFeedback: z.object({
    grammar: z.object({
      score: z.number(),
      feedback: z.string(),
      errors: z.array(z.string()).optional(),
      suggestions: z.array(z.string()).optional(),
    }),
    vocabulary: z.object({
      score: z.number(),
      feedback: z.string(),
      suggestions: z.array(z.string()).optional(),
    }),
    coherence: z.object({
      score: z.number(),
      feedback: z.string(),
      suggestions: z.array(z.string()).optional(),
    }),
    task_fulfillment: z.object({
      score: z.number(),
      feedback: z.string(),
      suggestions: z.array(z.string()).optional(),
    }),
  }),
  metadata: z.object({
    submittedAt: z.string(),
    processingTime: z.number(),
    embedding: z.array(z.number()).optional(),
    taskId: z.string().optional(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Progress analysis schema
export const ProgressAnalysisSchema = z.object({
  userId: z.string(),
  timeframe: z.enum(["7d", "30d", "90d", "1y"]),
  summary: z.object({
    total_writings: z.number(),
    avg_overall_score: z.number(),
    improvement_rate: z.string(),
    strongest_area: z.string(),
    areas_for_improvement: z.array(z.string()),
  }),
  trends: z.record(z.record(z.number())),
  insights: z.array(
    z.object({
      type: z.enum(["improvement", "pattern", "recommendation"]),
      message: z.string(),
      data: z.record(z.any()).optional(),
    })
  ),
  recommendations: z.array(z.string()),
});

// Form suggestion schema
export const FormSuggestionSchema = z.object({
  userId: z.string(),
  type: z.enum(["letter", "essay", "report", "email", "general"]).optional(),
  suggestions: z.object({
    structural_templates: z.array(
      z.object({
        name: z.string(),
        pattern: z.array(z.string()),
        success_rate: z.number(),
        used_count: z.number(),
        avg_score: z.number(),
      })
    ),
    reusable_phrases: z.array(
      z.object({
        context: z.string(),
        phrase: z.string(),
        usage_count: z.number(),
        avg_score_when_used: z.number(),
      })
    ),
    content_patterns: z.array(
      z.object({
        pattern_name: z.string(),
        template: z.string(),
        versatility: z.string(),
        examples: z.array(z.string()),
      })
    ),
    anti_patterns: z.array(
      z.object({
        pattern: z.string(),
        frequency_in_low_scores: z.number(),
        suggestion: z.string(),
      })
    ),
  }),
  personalized_recommendations: z.array(z.string()),
});

// Similarity search result schema
export const SimilaritySearchResultSchema = z.object({
  id: z.string(),
  similarity: z.number(),
  type: z.string(),
  prompt: z.string(),
  content: z.string(),
  scores: z
    .object({
      overall: z.number(),
    })
    .optional(),
  metadata: z.record(z.any()),
  submittedAt: z.string(),
});

// Pattern analysis schema
export const PatternAnalysisSchema = z.object({
  pattern_id: z.string(),
  pattern_name: z.string(),
  pattern_type: z.enum(["structural", "linguistic", "content"]),
  usage_frequency: z.number(),
  effectiveness_score: z.number(),
  success_rate: z.number(),
  avg_score_improvement: z.number(),
  applicable_contexts: z.array(z.string()),
  examples: z.array(
    z.object({
      writing_id: z.string(),
      excerpt: z.string(),
      score: z.number(),
    })
  ),
});

// Export types for JavaScript usage
export const WritingTypes = {
  LETTER: "letter",
  ESSAY: "essay",
  REPORT: "report",
  EMAIL: "email",
  GENERAL: "general",
};

export const CriteriaTypes = {
  GRAMMAR: "grammar",
  VOCABULARY: "vocabulary",
  COHERENCE: "coherence",
  TASK_FULFILLMENT: "task_fulfillment",
  ALL: "all",
};

export const TimeframeTypes = {
  WEEK: "7d",
  MONTH: "30d",
  QUARTER: "90d",
  YEAR: "1y",
};

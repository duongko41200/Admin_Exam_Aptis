const requestSummaryYT = `1. Context:
This prompt focuses on summarizing an English paragraph, highlighting its key context and main ideas, while ensuring clarity and accuracy in the response. The objective is to provide a thorough understanding of the text presented.

2. Objective:
Summarize an English paragraph by providing a comprehensive overview that includes the context of the text and its main content. Aim to break down the ideas clearly and highlight the significant points.

3. Task:
- Part 1: Describe the background of the paragraph, detailing its overall theme and primary focus. Identify and explain the key main ideas presented in the text.
- Part 2: Analyze the text in detail, breaking it down by sections. For each section, extract and explain the specific sentences that convey the main ideas, ensuring a clear connection to the original content.
- Provide a final assessment of the summary's accuracy and coherence, ensuring it aligns well with the original text's intent and message.

4. Format:
Deliver the summary in a structured format, clearly dividing it into two parts. Use headings for each section (Part 1 and Part 2) to enhance readability. The total response should be concise, yet informative, with a word limit of 200-250.

5. Approach:
- Primary Framework: Content breakdown and thematic analysis to ensure clarity and comprehensive understanding.
- Supporting Techniques: Use of textual evidence from the paragraph to support the points made in the summary.

6. Language and Tone:
- Input Language Detected: Vietnamese
- Prompt Language: English
- Response Language: Vietnamese
- Tone: Analytical and informative, suitable for a Vietnamese audience seeking a detailed understanding of the English text.

7. Response Instruction:
Provide the main response in Vietnamese. Ensure the summary captures the essence of the original paragraph while following the specified format.`

const getPrompSummaryYT = (combinedText: string) => {
  return `${combinedText}.${requestSummaryYT}`
}

export { getPrompSummaryYT }

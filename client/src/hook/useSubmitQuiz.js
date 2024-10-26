import { useState, useEffect, useCallback } from 'react';
import { getGeminiAiResearch } from '../services/AI/Gemini';
export const useSubmitQuiz = (question, level) => {
	const [isSubmit, setIsSubmit] = useState(false);
	const [countScore, setCountScore] = useState(0);

	const handleSubmit = useCallback(async () => {
		if (level == 1 || level == 2) {
			const correctAnswersCount = question.reduce((count, q) => {
				const selectedOption = q.options.find(
					(option) => option.isCheck
				);
				return selectedOption && selectedOption.name === q.answer
					? count + 1
					: count;
			}, 0);

			setCountScore(correctAnswersCount);
		}

		setIsSubmit(true);
	}, [question]);

	return {
		isSubmit,
		countScore,
		handleSubmit,
		setIsSubmit,
	};
};

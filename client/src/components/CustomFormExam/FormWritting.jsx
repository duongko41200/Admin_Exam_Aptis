import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { styles } from '../../style/general';

import './form.css';

function FormWritting({
	question,
	currentStep,
	handleSubmit,
	handleNextStep,
	handleBackStep,
	updateAnswer,
	isCheckChangeStep,
}) {
	const [answer, setAnswer] = useState();

	const updateAnswers = (e) => {
		const value = e.target.value;
		setAnswer(value);
		updateAnswer(value);
	};

	useEffect(() => {
		setAnswer(question ? question[currentStep]?.answer : '');
	}, [isCheckChangeStep]);

	return (
		<Box sx={styles.container}>
			<Box sx={styles.questionBox}>
				<Box sx={styles.innerQuestionBox}>
					<Box sx={styles.questionTextBox}>
						<Box sx={styles.questionHeader}>Question:</Box>
						<Box sx={styles.questionText}>
							{question ? question[currentStep]?.questions : ''}
						</Box>
					</Box>
				</Box>
			</Box>
			<Box sx={styles.optionsContainer}>
				<textarea
					aria-label="minimum height"
					minRows={7}
					placeholder="Điền câu trả lời của bạn tại đây!"
					value={answer}
					onChange={updateAnswers}
					className="textarea"
				/>
			</Box>

			<Box sx={styles.buttonContainer}>
				<Button
					variant="contained"
					sx={styles.backButton}
					onClick={handleBackStep}
				>
					Back
				</Button>
				{currentStep === question?.length - 1 ? (
					<Button
						variant="contained"
						sx={styles.submitButton}
						onClick={handleSubmit}
					>
						Submit
					</Button>
				) : (
					<Button
						variant="contained"
						sx={styles.nextButton}
						onClick={handleNextStep}
					>
						Next
					</Button>
				)}
			</Box>
		</Box>
	);
}

export default FormWritting;

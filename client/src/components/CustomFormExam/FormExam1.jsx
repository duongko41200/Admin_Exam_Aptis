import React from 'react';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Box, Button, Checkbox } from '@mui/material';
import { styles } from '../../style/general';

function FormExam1({
	question,
	currentStep,
	handleSubmit,
	handleNextStep,
	handleSelected,
	handleBackStep,
}) {
	return (
		<Box sx={styles.container}>
			<Box sx={styles.questionBox}>
				<Box sx={styles.innerQuestionBox}>
					<Box sx={styles.questionTextBox}>
						<Box sx={styles.questionHeader}>Question:</Box>
						<Box sx={styles.questionText}>
							{question[currentStep]?.questions}
						</Box>
					</Box>
				</Box>
			</Box>

			<Box sx={styles.optionsContainer}>
				{question[currentStep]?.options?.map((option, idx) => (
					<Box
						key={idx}
						sx={styles.optionBox(option.isCheck)}
						onClick={() => handleSelected(idx)}
					>
						<Box>{option.name}</Box>
						<Checkbox
							icon={<RadioButtonUncheckedIcon />}
							checkedIcon={<RadioButtonCheckedIcon />}
							checked={option.isCheck}
						/>
					</Box>
				))}
			</Box>

			<Box sx={styles.buttonContainer}>
				<Button
					variant="contained"
					sx={styles.backButton}
					onClick={handleBackStep}
				>
					Back
				</Button>
				{currentStep === question.length - 1 ? (
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

export default FormExam1;

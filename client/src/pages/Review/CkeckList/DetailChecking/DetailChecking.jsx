import React, { useEffect, useState, useMemo } from 'react';
import CustomModalMotion from '../../../../components/ui/CustomFormModal/CustomModalMotion';
import { Box } from '@mui/material';
import SpinnerLoading from '../../../../components/ui/SpinnerLoading/SpinnerLoading';
import ResultsLevel1 from '../../../../components/CustomFormResult/ResultsLevel';
import { getProps } from '../../../../Constant/DetailChecking';
import { useQuiz } from '../../../../hook/useQuiz';
import { useSubmitQuiz } from '../../../../hook/useSubmitQuiz';
import {
	getGeminiAi,
	getGeminiAiResearch,
} from '../../../../services/AI/Gemini';
import {
	questionLevel3,
	questionLevel4,
} from '../../../../Constant/DetailChecking/Question/question';
import { FORM_COMPONENTS } from '../../../../Constant/DetailChecking/maneger-component';

const DetailChecking = ({
	open,
	closeModalBottom,
	text,
	level,
	define,
	idText,
	dayReview,
	valueReview,
	setListChecking,
}) => {
	const [resGeminiResearch, setResGeminiResearch] = useState([]);
	const {
		question,
		currentStep,
		handleStepChange,
		handleSelected,
		setQuestion,
		isCheckChangeStep,
		setCurrentStep,
	} = useQuiz();
	const { isSubmit, countScore, setIsSubmit, handleSubmit } =
		useSubmitQuiz(question, level);
	const [showSpinner, setShowSpinner] = useState(false);

	const handleSaveUpdate = async () => {
		setShowSpinner(true);
		try {
			const reponseOfGemini = await getGeminiAi(level, text);

			console.log({ reponseOfGemini });
			setQuestion(reponseOfGemini.question);
		} catch (error) {
			console.error('Error generating content:', error);
		} finally {
			setShowSpinner(false);
		}
	};
	const updateAnswer = (answer) => {
		let answers = question?.map((value, idx) => {
			if (idx === currentStep) {
				value.answer = answer;
			}

			return value;
		});

		setQuestion(answers);
	};

	const formProps = useMemo(
		() => ({
			question,
			isCheckChangeStep,
			currentStep,
			handleNextStep: () => handleStepChange(1),
			handleBackStep: () => handleStepChange(-1),
			updateAnswer,
			handleSelected,
			handleSaveUpdate,
			handleSubmit,
		}),
		[
			question,
			currentStep,
			isCheckChangeStep,
			updateAnswer,
			handleStepChange,
			handleSelected,
			handleSubmit,
		]
	);

	const FormComponent = FORM_COMPONENTS[level];
	const props = getProps(level, formProps, text);

	const getDataGeminiAi = async () => {
		try {
			const res = await getGeminiAiResearch(level, text);

			setResGeminiResearch(res.data);
		} catch (error) {
			console.log({ error });
			setResGeminiResearch([]);
		}
	};

	const geminiAiResultLevel3 = async () => {
		try {
			console.log({ question });

			const res = await getGeminiAiResearch(level, question);

			setResGeminiResearch(res.data);
		} catch (error) {
			console.log({ error });
			setResGeminiResearch([]);
		}
	};

	useEffect(() => {
		setIsSubmit(false);
		setCurrentStep(0);
		setResGeminiResearch([]);
		setQuestion('');

		if (open) {
			if (level === 1 || level === 2) {
				handleSaveUpdate();
			}
			if (level === 3) {
				setQuestion(questionLevel3(text));
			}
			if (level === 4) {
				setQuestion(questionLevel4(text, define));
			}
		}
	}, [open]);

	useEffect(() => {
		if (isSubmit) {
			if (level === 1 || level === 2) {
				getDataGeminiAi();
			}
			if (level === 3 || level === 4) {
				geminiAiResultLevel3();
			}
		}
	}, [isSubmit]);

	return (
		<CustomModalMotion
			open={open}
			closeModalBottom={closeModalBottom}
			handleSaveUpdate={handleSaveUpdate}
			showButtonSave={false}
			padding={0}
			bgcolor="#fff"
		>
			<SpinnerLoading show={showSpinner}>
				{!showSpinner ? (
					!isSubmit ? (
						<FormComponent {...props} />
					) : (
						<ResultsLevel1
							result={countScore}
							question={question}
							text={text}
							level={level}
							idText={idText}
							dayReview={dayReview}
							valueReview={valueReview}
							setListChecking={setListChecking}
							closeModalBottom={closeModalBottom}
							resGeminiResearch={resGeminiResearch}
						/>
					)
				) : (
					<Box
						sx={{
							width: '100%',
							height: '500px',
							background: '#aec0dd38',
							border: '1px solid hsl(215, 15%, 89%)',
							borderRadius: '30px',
							boxShadow: 'rgba(223, 226, 231, 0.6) 0px 4px 8px',
							display: 'flex',
							flexDirection: 'column',
							gap: 1,
						}}
					></Box>
				)}
			</SpinnerLoading>
		</CustomModalMotion>
	);
};

export default DetailChecking;

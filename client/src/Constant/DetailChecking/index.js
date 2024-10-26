const getProps = (level, props, text) => {
	// console.log({ props });
	switch (level) {
		case 1:
		case 2:
			return {
				question: props.question,
				currentStep: props.currentStep,
				handleSubmit: props.handleSubmit,
				handleNextStep: props.handleNextStep,
				handleSelected: props.handleSelected,
				handleBackStep: props.handleBackStep,
			};

		case 3:
		case 4:
			return {
				question: props.question,
				isCheckChangeStep: props.isCheckChangeStep,
				currentStep: props.currentStep,
				handleSubmit: props.handleSubmit,
				handleNextStep: props.handleNextStep,
				handleSelected: props.handleSelected,
				handleBackStep: props.handleBackStep,
				updateAnswer: props.updateAnswer,
			};
		default:
			return null;
	}
};

const reviewResult = (score, level) => {
	if (score == 100) {
		return `Bạn đã hoàn thành tốt level ${level}. Hãy giữ vũng phong độ nhé:))`;
	}

	if (score >= 80) {
		return 'Kết quả bạn khá tốt. Hãy tiếp tục ôn tập';
	}
	if (score >= 60) {
		return 'Kết quả bạn tạm được. Mình tin lần sau bạn sẽ tốt hơn:))';
	}
	if (score >= 40) {
		return 'Bạn Chưa thật sự là học tập. Bạn cần học lại';
	} else {
		return ' Bạn cần học lại câu/từ này thôi, mình thấy bạn không nhớ gì hết';
	}
};

const statusCore = (score) => {
	if (score >= 80) {
		return 'Excellent';
	}
	if (score >= 60) {
		return 'Good';
	} else {
		return 'Poor';
	}
};

const handleScore = (result, resGeminiResearch, level) => {
	if (level == 1 || level == 2) {
		return (result / (level === 1 ? 3 : 5)) * 100;
	}
	if (level == 3) {
		return (
			((parseInt(resGeminiResearch[0]?.score) +
				parseInt(resGeminiResearch[1]?.score)) /
				2) *
			10
		);
	}
};

export { getProps, reviewResult, statusCore, handleScore };

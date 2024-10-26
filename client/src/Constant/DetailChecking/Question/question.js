const questionLevel3 = (text, define) => {
	return [
		{
			id: 0,
			questions: `Translate " ${text} " into Vietnamese.`,
			answer: '',
		},
		{
			id: 1,
			questions: `Write a similar sentence with " ${text} "`,
			answer: '',
		},
	];
};

const questionLevel4 = (text, define) => {
	return [
		{
			id: 0,
			questions: `Translate this sentence: "${define}" into English`,
			answer: '',
		},
		{
			id: 1,
			questions: `Write a similar sentence with " ${define} "`,
			answer: '',
		},
	];
};

export { questionLevel3, questionLevel4 };

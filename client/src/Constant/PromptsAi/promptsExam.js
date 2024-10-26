const ruleQues = (text) => {
	const rule = `question 1: What does ${text} mean? with 3 multiple choice answers (vietnamese)`;
	const rule2 = `question 2: Choose the correct description of the ${text}? with 3 multiple choice answers (English)`;
	const rule3 = `question3: In what situations should ${text}  be used? with 3 multiple choice answers (English)`;
	const rule4 = `All questions are in English`;

	const rule5 = `you are a quiz master. generate 3 random questions about`;

	const roleAll = `${rule5} ${rule4}. ${rule}. ${rule2}. ${rule3}`;

	return roleAll;
};

const ruleQues2 = (text) => {
	const rule1 = `question 1: What does ${text} mean? with 3 multiple choice answers (vietnamese)`;
	const rule2 = `question 2: Choose the correct description of the ${text}? with 3 multiple choice answers (English)`;
	const rule3 = `question3: In what situations should ${text}  be used? with 3 multiple choice answers (English)`;
	const rule4 = `All questions are in English`;
	const rule5 = `Questions number 4 and 5 will be two random questions relevant to ${text}, but they should not be similar to the ideas of the first 3 questions`;

	const rule = `you are a quiz master. generate 3 random questions about`;

	const roleAll = `${rule} ${rule4}. ${rule1}. ${rule2}. ${rule3}. ${rule5}`;

	return roleAll;
};
const ruleQues3 = (text) => {

	const rule1 = `General comments on the question and answer of this quesstion 1: ${text[0].questions} - answer 1: ${text[0].answer},  quesstion 2: ${text[1].questions} - answer 2: ${text[1].answer}, to see if they are compatible with each other and If not correct, please explain why it is incorrect `;
	const rule2 = `with correct: if the answer is not grammatically correct or not appropriate to the question. Analyze the points that didn't correct and recoment suggestions to avoid mistakes`;
	const rule3 = `with reference: Write corfect answers for each question:quesstion 1: ${text[0].questions} - answer 1: ${text[0].answer},  quesstion 2: ${text[1].questions} - answer 2: ${text[1].answer}`;
	const rule4 = `with score: I want you to evaluate the fit between the question and the answer. on a scale of 1 to 10: ${text[0].questions} - answer 1: ${text[0].answer},  quesstion 2: ${text[1].questions} - answer 2: ${text[1].answer}`
	const rule = `You are an English master.`;

	const roleAll = `${rule}. ${rule1}. ${rule2}. ${rule3}. ${rule4}`;

	return roleAll;
};

const getRule = (level, text) => {
	switch (level) {
		case 1:
			return ruleQues(text);
		case 2:
			return ruleQues2(text);

		default:
			break;
	}
};

const ruleResult1 = () => {
	const rule = `value of scenarios by VietNamese , value of example by English`;

	return rule;
};

const promptExam = (level, text) => {
	switch (level) {
		case 1:
		case 2:
			return `you are a quiz master. generate 3 random questions about ${getRule(
				level,
				text
			)} with 3 multiple choice answers. Also provide the answer separately. The response should be in the following FORMAT:{"question":[{"id":0,"questions":"", "options":[{"name": "option1","isCheck":false},...],"answer":""},...}]}. Note:Identical to FORMAT and do not add any other characters and Set the isCheck property to false`;
		case 3:
			return;

		default:
			break;
	}
};

const promptResearch = (level, text) => {
	switch (level) {
		case 1:
		case 2:
			return `I want 3-5 scenarios for using the phrase '${text}'. The response should be in the following FORMAT:{"data":[{"id":0,"scenarios":"", "example":""]}. Note: Same output as FORMAT and do Not add any other characters and ${ruleResult1()}`;
		case 3:
		case 4 :
			return `The response should be in the following FORMAT:{"data":[{"comment":"", "correct":"", "reference":"","score":""}]}. Note: Identical to FORMAT and do Not add any other characters and ${ruleQues3(text)}`;

		default:
			break;
	}
};

export { promptExam, promptResearch };

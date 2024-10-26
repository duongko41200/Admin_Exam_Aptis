import { GoogleGenerativeAI } from '@google/generative-ai';
import { promptExam, promptResearch } from '../../Constant/PromptsAi/promptsExam';

const getGeminiAi = async (level, texts) => {
	const genAI = new GoogleGenerativeAI(
		'AIzaSyAwEvAGplcQa0zvl_FWYA5yOlcBVJDb8nA'
	);
	const model = genAI.getGenerativeModel({
		model: 'gemini-1.5-flash',
	});
	const prompt = promptExam(level, texts);
	const result = await model.generateContent(prompt);
	const response = result.response;
	const text = await response.text();
	console.log({ text });

	const convertTextByJson = JSON.parse(text);
	console.log({ convertTextByJson });

	return convertTextByJson;
};

const getGeminiAiResearch = async (level, texts) => {
	const genAI = new GoogleGenerativeAI(
		'AIzaSyAwEvAGplcQa0zvl_FWYA5yOlcBVJDb8nA'
	);
	const model = genAI.getGenerativeModel({
		model: 'gemini-1.5-flash',
	});
	const prompt = promptResearch(level, texts);

	console.log({prompt})
	const result = await model.generateContent(prompt);
	const response = result.response;
	const text = await response.text();
	console.log({ text });

	const convertTextByJson = JSON.parse(text);
	console.log({ convertTextByJson });

	return convertTextByJson;
};

export { getGeminiAi,getGeminiAiResearch };

import dayjs from 'dayjs';

function convertToDate(dateString) {
	const [year, month, day] = dateString.split('/').map(Number);
	return new Date(year, month - 1, day);
}
function filterByDayBeforeToday(data) {
	const today = new Date();

	return data.filter((item) => {
		const itemDate = convertToDate(item.day);
		return itemDate <= today;
	});
}

const startDate = (numberDate) => {
	const now = dayjs().subtract(numberDate, 'day');

	const convertMili = now.valueOf();

	return convertMili;
};
const filterTypeText = (data, type) => {
	return data.filter((value) => value.typeText === type);
};

const countTextInWeek = (texts, startDate) => {
	let date = startDate;
	let countEachDay = [];
	for (let i = 0; i < 7; i++) {
		let count = 0;
		for (let j = 0; j < texts.length; j++) {
			if (
				dayjs(date).format('YYYY/MM/DD') ==
				dayjs(texts.createdAt).format('YYYY/MM/DD')
			) {
				count++;
			}
		}
		countEachDay.push({ count, date });
		date = dayjs(date).add(1, 'day').format('YYYY/MM/DD');
	}

	return countEachDay;
};

// filter count word/sentence in week
const filterByWeek = () => {
	const now = new Date();
	const dayOfWeek = now.getDay();

	let getData = JSON.parse(localStorage.getItem('textData')) ?? [];

	const dataWeek = getData.filter(
		(value) =>
			startDate(dayOfWeek != 0 ? dayOfWeek - 1 : 6) <=
			new Date(value.createdAt).getTime()
	);

	const formatDate = dayjs(
		startDate(dayOfWeek != 0 ? dayOfWeek - 1 : 6)
	).format('YYYY/MM/DD');

	const word = filterTypeText(dataWeek, 'word');
	const sencence = filterTypeText(dataWeek, 'sentence');
	console.log({ word, sencence });

	const result = {
		word: countTextInWeek(word, formatDate),
		sentence: countTextInWeek(sencence, formatDate),
		startDay: dayjs(
			startDate(dayOfWeek != 0 ? dayOfWeek - 1 : 6)
		).format('YYYY/MM/DD'),
	};

	return result;
};

export { filterByDayBeforeToday, filterByWeek };

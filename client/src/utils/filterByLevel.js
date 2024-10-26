import dayjs from 'dayjs';

export const filterTypeText = (level) => {
	let getData = JSON.parse(localStorage.getItem('textData')) ?? [];
	const dataMonth = getData.filter(
		(value) =>
			dayjs(value.createdAt).format('MM') ==
			dayjs(new Date()).format('MM')
	);
	const result = dataMonth.filter((value) => value.repeat == level);

	return result?.length;
};

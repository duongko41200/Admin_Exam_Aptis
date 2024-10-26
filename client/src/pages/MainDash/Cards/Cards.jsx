import React, { useEffect, useState } from 'react';
import './Cards.css';
import Card from './Card/Card';
import dayjs from 'dayjs';
import { filterByWeek } from '../../../utils/filterByDay';

const startDate = (numberDate) => {
	const now = dayjs().subtract(numberDate, 'day');

	const convertMili = now.valueOf();

	return convertMili;
};

const filterTypeText = (getData, type) => {
	const result = getData.filter((value) => (value.typeText = type));

	return result;
};

const Cards = () => {
	const [overviewWeek, setOverviewWeek] = useState({});
	const [overviewMonth, setOverviewMonth] = useState({});


	filterByWeek()




	const handleQuantity = () => {
		const now = new Date();

		// Lấy ngày trong tuần (0 - Chủ Nhật, 1 - Thứ Hai, ..., 6 - Thứ Bảy)
		const dayOfWeek = now.getDay();

		let getData = JSON.parse(localStorage.getItem('textData')) ?? [];

		const dataWeek = getData.filter(
			(value) =>
				startDate(dayOfWeek != 0 ? dayOfWeek - 1 : 6) <=
				new Date(value.createdAt).getTime()
		);
		const dataMonth = getData.filter(
			(value) =>
				dayjs(value.createdAt).format('MM') ==
				dayjs(new Date()).format('MM')
		);

		const totalWordWeek = filterTypeText(dataWeek, 'word');
		const totalWordMonth = filterTypeText(dataMonth, 'word');

		const overviewMonth = {
			total: dataMonth?.length,
			totalWord: totalWordMonth?.length,
			totalSentence: dataMonth?.length - totalWordMonth?.length,
		};
		const overviewWeek = {
			total: dataWeek?.length,
			totalWord: totalWordWeek?.length,
			totalSentence: dataWeek?.length - totalWordWeek?.length,
		};

		setOverviewWeek(overviewWeek);
		setOverviewMonth(overviewMonth);
	};

	useEffect(() => {
		handleQuantity();
	}, []);

	return (
		<div className="Cards">
			<div className="parentContainer">
				<Card
					title={`Tháng ${dayjs(new Date()).format('MM')}`}
					value={overviewMonth}
				/>
			</div>
			<div className="parentContainer">
				<Card title="Tuần Này" value={overviewWeek} />
			</div>
		</div>
	);
};

export default Cards;

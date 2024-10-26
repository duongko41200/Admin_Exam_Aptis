import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';
import './Bar.css';
import dayjs from 'dayjs';
import { filterTypeText } from '../../utils/filterByLevel';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const Bars = () => {
	const options = {
		responsive: true,
		plugins: {
			datalabels: { display: false },
			legend: {
				position: 'left',
			},
			title: {
				display: true,
				text: '',
				position: 'top',
			},
		},
	};

	const labels = [
		`số từ/câu theo từng cấp độ trong Tháng ${dayjs(new Date()).format(
			'MM'
		)}`,
	];

	const data = {
		labels,
		datasets: [
			{
				label: 'cấp1',
				data: [filterTypeText(1)],
				backgroundColor: '#EDC349',
			},
			{
				label: 'cấp 2',
				data: [filterTypeText(2)],
				backgroundColor: '#FFA01B',
			},
			{
				label: 'cấp 3',
				data: [filterTypeText(3)],
				backgroundColor: '#C61F2B',
			},
			{
				label: 'cấp 4',
				data: [filterTypeText(4)],
				backgroundColor: '#6E314F',
			},
			{
				label: 'cấp 5',
				data: [filterTypeText(5)],
				backgroundColor: '#502380',
			},
			{
				label: 'cấp 6',
				data: [filterTypeText(6)],
				backgroundColor: '#0A3161',
			},
			{
				label: 'cấp 7',
				data: [filterTypeText(7)],
				backgroundColor: '#3E8F78',
			},
		],
	};
	return (
		<>
			<div className="wrapper-title">
				<div className="title-bar">Phân tích dữ liệu</div>
				<div className="title-detail">xem chi tiết</div>
			</div>

			<Bar options={options} data={data} />
		</>
	);
};

export default Bars;

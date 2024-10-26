import React from 'react';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
import { filterByWeek } from '../../../utils/filterByDay';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const LineChart = () => {
	const args = {
		width: '100%',
		height: '60px',
	};

	const options = {
		responsive: true,
		interaction: {
			mode: 'index',
			intersect: false,
		},
		stacked: false,
		plugins: {
			datalabels: { display: false },
			title: {
				display: false,
				text: 'Chart.js Line Chart - Multi Axis',
			},
		},
		scales: {
			y: {
				type: 'linear',
				display: true,
				position: 'left',
			},
			y1: {
				type: 'linear',
				display: true,
				position: 'right',
				grid: {
					drawOnChartArea: false,
				},
			},
		},
	};

	const labels = filterByWeek().word.map((value) => value.date);

	// console.log("tesst:",filterByWeek().word.map(value=>value.count))

	const data = {
		labels,
		datasets: [
			{
				label: 'số câu',
				data: filterByWeek().sentence.map((value) => value.count), // thống kê theo tháng số câu đã học
				borderColor: '#f6113d',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				yAxisID: 'y',
				min: 0,
			},
			{
				label: 'số từ',
				data: filterByWeek().word.map((value) => value.count),
				borderColor: '#2563eb',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
				yAxisID: 'y1',
				min: 0,
			},
		],
	};
	return (
		<>
			<div className="wrapper-pie flex items-center justify-center w-full h-full">
				<div className=" h-full w-[100%] sm:w-[50%] flex justify-center">
					<Line {...args} data={data} options={options} />
				</div>
			</div>
		</>
	);
};

export default LineChart;

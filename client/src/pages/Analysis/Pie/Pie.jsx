import React from 'react';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { filterTypeText } from '../../../utils/filterByLevel';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);



const PieChart = () => {
	const data = {
		// labels: ['Red', 'Blue', 'Yellow', 'Green'],
		datasets: [
			{
				label: 'Số lượng',
				data: [
					filterTypeText(1),
					filterTypeText(2),
					filterTypeText(3),
					filterTypeText(4),
					filterTypeText(5),
					filterTypeText(6),
					filterTypeText(7),
				],
				backgroundColor: [
					'#EDC349',
					'#FFA01B',
					'#C61F2B',
					'#6E314F',
					'#502380',
					'#0A3161',
					'#3E8F78',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			},
		],
	};
	
	const options = {
		plugins: {
			datalabels: {
				formatter: (value, context) => {
					const dataset =
						context.chart.data.datasets[context.datasetIndex];
					const total = dataset.data.reduce((acc, val) => acc + val, 0);
					const percentage = ((value / total) * 100).toFixed(2) + '%';
					return percentage;
				},
				color: 'white', // Màu sắc của phần trăm
				anchor: 'center', // Vị trí của phần trăm
				align: 'end', // Căn chỉnh của phần trăm
				offset: -10, // Khoảng cách giữa phần trăm và biểu đồ
				display: (context) =>
					context.dataset.data[context.dataIndex] /
						context.dataset.data.reduce((acc, val) => acc + val, 0) >
					0,
			},
		},
	};
	const args = {
		width: '100%',
		height: '100px',
	};
	return (
		<>
			<div className="wrapper-pie flex items-center justify-center w-full h-full">
				<div className=" h-full w-[85%] sm:w-[50%] flex justify-center">
					<Pie {...args} data={data} options={options} />
				</div>
			</div>
		</>
	);
};

export default PieChart;

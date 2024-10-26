import React from 'react';
import PieChart from './Pie/Pie';
import LineChart from './Line/Line';
import './Analysis.css';
const Analysis = () => {
	return (
		<div className="wrapper-analysis">
			<div className="pie flex flex-col">
				<div className="header-pie px-4 py-2">
					<div className="sub-header">Phân tích dữ liệu</div>
					<div className="italic text-gray-400">
						Nơi phơi bày sự thật
					</div>
				</div>

				<div className="bg-white rounded-t-2xl p-4 pt-2">
					<div className="w-full flex justify-between bg-white rounded-xl py-4">
						<div className="font-bold">Độ lặp câu/từ trong tháng</div>
						<div className="text-yellow-500 italic underline">
							xem chi tiết
						</div>
					</div>

					{/* // content PIE */}
					<div className="bg-slate-100 ">
						{/* filter date */}
						<div className="flex justify-between">
							<div className="p-2 pb-0 ">
								<select id="cars" className="bg-yellow-100 rounded-sm">
									<option value="volvo">8</option>
									<option value="saab">9</option>
									<option value="vw">10</option>
									<option value="audi" selected>
										11
									</option>
								</select>
							</div>
							<div className="p-2 pb-0 ">
								<select id="cars" className="bg-yellow-100 rounded-sm">
									<option value="volvo">8</option>
									<option value="saab">9</option>
									<option value="vw">10</option>
									<option value="audi" selected>
										2024
									</option>
								</select>
							</div>
						</div>

						<div className="flex justify-between bg-slate-100 p-2 pt-0 rounded-xl">
							<div className="w-fit flex flex-col gap-4 pt-8">
								<div className="flex w-[55px] items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#EDC349]"></div>
									<div className="w-[50px]"> cấp 1</div>
								</div>
								<div className="flex w-[55px] items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#FFA01B]"></div>
									<div className="w-[50px]"> cấp 2</div>
								</div>
								<div className="flex w-[55px] items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#C61F2B]"></div>
									<div className="w-[50px]"> cấp 3</div>
								</div>
								<div className="flex w-[55px] items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#6E314F]"></div>
									<div className="w-[50px]"> cấp 4</div>
								</div>
							</div>
							<div className="w-[100%]">
								<PieChart />
							</div>

							<div className="w-fit  flex flex-col gap-4 pt-8">
								<div className="flex w-[55px] items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#502380]"></div>
									<div className="w-[50px]"> cấp 5</div>
								</div>
								<div className="flex w-[55px] items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#0A3161]"></div>
									<div className="w-[50px]"> cấp 6</div>
								</div>
								<div className="flex w-[55px] items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#3E8F78]"></div>
									<div className="w-[50px]"> cấp 7</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* //// LINE CHART */}
			<div className="line bg-white flex flex-col gap-4  p-4 pt-2">
				<div className="flex justify-between">
					<div className="font-bold">Hành trình 1 năm</div>
					<div className="text-yellow-500 italic underline">
						xem chi tiết
					</div>
				</div>
				<div>
					<LineChart />
				</div>
			</div>

			{/* // Topic */}
			<div className="topic bg-white flex flex-col gap-4  p-4 pt-2">
				<div className="font-bold">Câu/từ theo chủ đề</div>
				<div className="filter mb-2">
					<div className="flex justify-end">
						<div className="bg-yellow-100 ">
							<div className="text-sm">Tháng</div>
							<select id="cars" className="bg-yellow-100 ">
								<option value="volvo">Volvo</option>
								<option value="saab">Saab</option>
								<option value="vw">VW</option>
								<option value="audi" selected>
									11
								</option>
							</select>
						</div>
						<div className="bg-yellow-100">
							<div className="text-sm">Năm</div>
							<select id="cars" className="bg-yellow-100 ">
								<option value="volvo">Volvo</option>
								<option value="saab">Saab</option>
								<option value="vw">VW</option>
								<option value="audi" selected>
									2024
								</option>
							</select>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2 list-topic">
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
					<div className="flex flex-col  p-2 bg-topic rounded-lg">
						<div className="detail-list flex justify-between items-center">
							<div className="detail-list__top flex flex-col">
								<div className="flex items-center ">
									<div className="font-bold">ĐỜI SỐNG</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>Số lượng: 100</div>
								</div>
							</div>

							<div className="flex justify-end w-[100px] h-full items-center">
								<ion-icon
									name="add-circle-outline"
									className="text-4xl"
								></ion-icon>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analysis;

import React, { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import TextService from '../../../services/API/tex.service';
import {
	BG_COLOR,
	LIMIT_LIST_TEXT_OF_PAGE,
	RES_DATA,
} from '../../../Constant/global';
import DetailChecking from './DetailChecking/DetailChecking.jsx';
import { Box, Pagination, Stack } from '@mui/material';
import { functionPagination } from '../../../utils/pagination.js';
import { filterByDayBeforeToday } from '../../../utils/filterByDay.js';



function transformData(data) {
	// Initialize an object to group items by day
	const groupedByDay = data.reduce((acc, item) => {
		const day = dayjs(item.dayReview).format('YYYY/MM/DD');

		// If the day doesn't exist in the accumulator, create an entry
		if (!acc[day]) {
			acc[day] = [];
		}

		// Add the item to the appropriate day
		acc[day].push(item);

		return acc;
	}, {});

	// Convert the grouped object to the desired array format
	return Object.keys(groupedByDay)
		.sort((a, b) => new Date(b) - new Date(a)) // Sort from most recent to oldest
		.map((day) => ({
			day: day,
			metaData: groupedByDay[day],
			isShow: false,
		}));
}
function CheckList() {
	const [openModalTest, setOpenModalTest] = useState(false);
	const [listChecking, setListChecking] = useState([]);
	const [textChoose, setTextChoose] = useState('');
	const [define, setDefine] = useState('');
	const [idText, setIdText] = useState('');
	const [level, setLevel] = useState('');
	const [dayReview, setDayReview] = useState('');

	const [valueReview, setValueReview] = useState('');
	const [allCheckList, setAllCheckList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [tempCurrentPage, setTempCurrentPage] = useState('');
	const [totalPages, setTotalPages] = useState('');

	const fetchData = async () => {
		// let localStorageChecking = JSON.parse(localStorage.getItem('listChecking')) || [];
		try {
			const currentDay = dayjs(new Date()).format('YYYY/MM/DD');

			let localStorageChecking =
				JSON.parse(localStorage.getItem('textData')) || [];

			const transformedData = await transformData(localStorageChecking);

			localStorage.setItem(
				'listChecking',
				JSON.stringify(transformedData)
			);

			const listChekingFilterDay =
				filterByDayBeforeToday(transformedData);

			const dataFilterPage = await functionPagination(
				currentPage != tempCurrentPage ? currentPage : 1,
				listChekingFilterDay
			);

			setAllCheckList(listChekingFilterDay);
			setTotalPages(
				Math.ceil(
					listChekingFilterDay?.length / LIMIT_LIST_TEXT_OF_PAGE
				)
			);
			setListChecking(dataFilterPage);
		} catch (error) {
			console.log({ error });
			setIsShow(false);
		}
	};

	const handleChangePage = async (e, value) => {
		console.log({ value });
		if (currentPage != value) {
			setCurrentPage(value);
			const dataFilterPage = await functionPagination(
				currentPage != tempCurrentPage ? currentPage : 1,
				allCheckList
			);

			setListChecking(dataFilterPage);
		}
	};

	const handleOpenListChek = (valueCheck) => {
		console.log({ valueCheck, listChecking });
		let cloneListChecking = listChecking;
		cloneListChecking = cloneListChecking.map((value, idx) => {
			if (value.day == valueCheck.day) {
				value.isShow = !value.isShow;
			}

			return value;
		});

		setListChecking(cloneListChecking);
	};
	const handleShowListTest = (value) => {
		setOpenModalTest(true);
		setTextChoose(value.text);
		setLevel(value.repeat);
		setDefine(value.defind);
		setIdText(value._id);
		setDayReview(value.dayReview);

		setValueReview(value);
	};
	const closeModalBottom = () => {
		setOpenModalTest(false);
	};

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<>
			<div
				className={`filter-check flex justify-start pt-4 w-full pb-2 `}
			>
				<div className="filter-level w-full">
					<div className="filter mb-2 ">
						<div className="flex justify-between">
							<div>
								<div className=" font-bold">
									Đến giờ nâng cấp câu/từ của bạn rồi
								</div>
								<div className="text-gray-400 text-sm italic">
									Ấn vào các khung bên dưới để ôn tập nào!
								</div>
							</div>
						</div>
					</div>

					<div className="border-t-2 pt-2 flex justify-between w-full">
						{/* <div>
							<select
								id="level"
								className="font-bold bg-white w-fit"
								// value={currentLevel}
							>
								<option value="all">Hàng tháng</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
							</select>
						</div> */}

						<div>
							<Stack spacing={2}>
								{/* <Pagination count={10} shape="rounded" /> */}
								<Pagination
									count={totalPages}
									variant="outlined"
									shape="rounded"
									size="small"
									defaultPage={currentPage}
									siblingCount={0}
									onChange={handleChangePage}
									page={currentPage}
									// disabled={isShow}
								/>
							</Stack>
						</div>
					</div>
				</div>
			</div>

			<div className="wrapper-lists flex flex-col gap-3 pt-4">
				<div className={`detail-list flex flex-col gap-3 rounded-lg`}>
					{listChecking &&
						listChecking.map((value, idx) => {
							return (
								<div key={idx}>
									<div
										className={`detail-list__top flex justify-between pt-2 px-2 rounded-t-xl bg-slate-100 border shadow-md ${
											!value.isShow
												? 'pb-3 rounded-b-xl'
												: 'bg-slate-200 pb-3'
										} `}
										key={idx}
										onClick={() => handleOpenListChek(value)}
									>
										<div className="flex gap-2">
											<div className=" px-2 w-fit rounded-lg">
												<ArrowDropDownIcon />
											</div>
											<div className="font-bold flex items-end text-sm text-end">
												<div>{value.day}</div>
											</div>
										</div>

										<div className="text-sm italic text-gray-400 flex items-end ">
											<div>Tổng: {value.metaData?.length} câu/từ</div>
										</div>
									</div>

									{value.isShow && (
										<motion.div
											key="content"
											initial="collapsed"
											animate="open"
											exit="collapsed"
											variants={{
												open: { y: 0, height: 'auto' },
												collapsed: { y: 0, height: 0 },
											}}
											transition={{
												duration: 0,
												ease: [0.04, 0.62, 0.23, 0.98],
											}}
											className="px-1 h-fit bg-[#eef5bd6c] py-2 flex flex-col gap-1 border shadow-md max-h-[450px] overflow-auto"
										>
											{value.metaData &&
												value.metaData?.map((value, idx) => {
													return (
														<Box
															key={idx}
															className=" flex flex-col gap-2 shadow-md p-2 rounded-md border bg-slate-100 px-4 "
															onClick={() => handleShowListTest(value)}
														>
															<div className="detail-list__top flex justify-between">
																<div className="flex gap-2">
																	<div className="flex items-center">
																		<div
																			className={` ${
																				value.typeText === 'word'
																					? 'type-word'
																					: 'type-sentence'
																			} px-2 w-fit rounded-lg text-sm `}
																		>
																			{value.typeText === 'word'
																				? 'Từ'
																				: 'Câu'}
																		</div>
																	</div>

																	{value.typeText === 'word' ? (
																		<div className="font-bold text-sm">
																			{value.text}
																		</div>
																	) : (
																		<div className="font-bold text-sm">
																			{value.attributes.structure}
																		</div>
																	)}
																</div>

																<div className="text-right min-w-[92px] text-sm">
																	{dayjs(value.createdAt).format(
																		'DD-MM-YYYY'
																	)}
																</div>
															</div>
															<div className="detail-list__bottom flex justify-between">
																<div className="w-[85%] text-sm">
																	{value.typeText === 'sentence' && (
																		<div>{value.text}</div>
																	)}
																	<div className="translate text-sm">
																		{value.defind}
																	</div>
																</div>

																<div
																	className={`bg-[${
																		BG_COLOR[value.repeat]
																	}] text-white p-1 h-fit text-xs align-center rounded-lg`}
																>
																	Cấp {value.repeat}
																</div>
															</div>
														</Box>
													);
												})}
										</motion.div>
									)}
								</div>
							);
						})}
				</div>
			</div>

			<DetailChecking
				open={openModalTest}
				closeModalBottom={closeModalBottom}
				text={textChoose}
				level={level}
				define={define}
				idText={idText}
				dayReview={dayReview}
				valueReview={valueReview}
				setListChecking={setListChecking}
			></DetailChecking>
		</>
	);
}

export default CheckList;

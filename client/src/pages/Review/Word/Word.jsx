import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	SET_OPEN_MODAL_DETAIL_TEXT,
	SET_TEXT_DETAIL,
	SET_UPDATE_TEXT,
	getListTextByFilter,
	SET_ELEMENT_FILTER,
} from '../../../store/feature/word';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
	LIMIT_LIST_TEXT_OF_PAGE,
	RES_DATA,
} from '../../../Constant/global';
import dayjs from 'dayjs';
import SpinnerLoading from '../../../components/ui/SpinnerLoading/SpinnerLoading';
import { SET_OPEN_MODAL_BOTTOM } from '../../../store/general';
import ModalBottom from '../../../components/ui/ModalBottom/ModalBottom';
import { LABEL_EDIT } from '../../../Constant/review';
import TextService from '../../../services/API/tex.service';
import { ToastError, ToastSuccess } from '../../../utils/Toast';
import { Toaster } from 'react-hot-toast';
import {
	UPDATE_SUCCESS,
	NOT_REQUIRED,
	NOT_UPDATE,
} from '../../../Constant/toast';
import { TextField } from '@mui/material';
import ModalCustomTopic from '../../../components/ui/ModalCustom/ModalCustomTopic';
import ModalCustomPhonetic from '../../../components/ui/ModalCustom/ModalCustomPhonetic';
import { functionPagination } from '../../../utils/pagination';

function Word() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isShow, setIsShow] = useState(false);
	const [openModalTopic, setOpenModalTopic] = useState(false);
	const [openModalPhoneTic, setOpenModalPhoneTic] = useState(false);
	const [topics, setTopics] = useState([]);
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [selectedYear, setSelectedYear] = useState(
		currentYear.toString()
	);
	const [currentLevel, setCurrentLevel] = useState('all');
	const [currentTypeText, setCurrentTypeText] = useState('all');
	const [textUpdate, setTextUpdate] = useState({});
	const [disable, setDisable] = useState(true);
	const [preTextUpdate, setPreTextUpdate] = useState({});

	const [topicSelected, setTopicSelected] = useState({});
	const [phoneTic, setPhoneTic] = useState('');

	const [listData, setListData] = useState([]);
	const [totalText, setTotalText] = useState('');

	const [totalPages, setTotalPages] = useState(0);
	const [allDataText, setAllDataText] = useState([]);
	const [tempCurrentPage, setTempCurrentPage] = useState('');

	/// REDUX ////

	const dispatch = useDispatch();

	const open = useSelector(
		(state) => state.generalStore.openModalBottom
	);

	/// FUNCTION HANDLE ///
	const handleChangePage = async (event, value) => {
		if (currentPage != value) {
			setCurrentPage(value);
		}
	};

	const handleShowModalDetail = (textId) => {
		const textDetail = listData.filter((text) => text._id === textId);

		let newTextDetail = {
			textId: textDetail[0]._id,
			text: textDetail[0].text,
			defind: textDetail[0].defind,
			typeText: textDetail[0].typeText,
			topic: textDetail[0].topicId?.name,
			topicId: textDetail[0].topicId?._id,
		};
		if (textDetail[0].typeText === 'word') {
			newTextDetail = {
				...newTextDetail,
				spelling: textDetail[0].attributes?.spelling,
				attributes: {
					createdAt: textDetail[0].attributes?.createdAt,
					spelling: textDetail[0].attributes?.spelling,
					audio: textDetail[0].attributes?.audio,
					userId: textDetail[0].attributes?.userId,
					updatedAt: textDetail[0].attributes?.updatedAt,
					advan_translation:
						textDetail[0].attributes?.advan_translation,
					_id: textDetail[0].attributes?._id,
				},
			};
		} else {
			newTextDetail = {
				...newTextDetail,
				structure: textDetail[0].attributes?.structure,
				attributes: {
					createdAt: textDetail[0].attributes?.createdAt,
					structure: textDetail[0].attributes?.structure,
					userId: textDetail[0].attributes?.userId,
					updatedAt: textDetail[0].attributes?.updatedAt,
					_id: textDetail[0].attributes?._id,
				},
			};
		}

		setTextUpdate(newTextDetail);
		setPreTextUpdate(newTextDetail);

		dispatch(SET_OPEN_MODAL_DETAIL_TEXT(true));
		dispatch(SET_TEXT_DETAIL(textDetail[RES_DATA]));
	};

	const handleSetTextUpdate = (value, e) => {
		const copyTextUpdate = structuredClone(textUpdate);

		if (value === 'spelling' || value === 'structure') {
			copyTextUpdate.attributes[value] = e.target.value;
		}

		copyTextUpdate[value] = e.target.value;

		if (
			preTextUpdate['text'] !== copyTextUpdate['text'] ||
			preTextUpdate['defind'] !== copyTextUpdate['defind'] ||
			preTextUpdate['topic'] !== copyTextUpdate['topic'] ||
			preTextUpdate['spelling'] !== copyTextUpdate['spelling'] ||
			preTextUpdate['structure'] !== copyTextUpdate['structure']
		) {
			setDisable(false);
		} else {
			setDisable(true);
		}
		setTextUpdate(copyTextUpdate);
	};

	const closeModalBottom = () => {
		dispatch(SET_OPEN_MODAL_BOTTOM(false));
		setDisable(true);
	};
	const onCancel = () => {
		setOpenModalTopic(false);
	};

	const onCancelModalPhoneTic = () => {
		setOpenModalPhoneTic(false);
	};

	const handleShowModalTopic = () => {
		let topicsLocalStorage = JSON.parse(localStorage.getItem('topics'));

		topicsLocalStorage = topicsLocalStorage.map((value) => {
			if (value._id === textUpdate.topicId) {
				value.isActive = true;
			}
			return value;
		});

		setTopics(topicsLocalStorage);

		setOpenModalTopic(true);
	};

	const handleShowModalPhoneTic = () => {
		setPhoneTic(textUpdate.spelling);
		setOpenModalPhoneTic(true);
	};

	const chooseTopic = (value) => {
		setTopicSelected(value);

		let cloneTopics = structuredClone(topics);

		cloneTopics = cloneTopics.map((topic) => {
			if (topic._id === value._id) {
				topic.isActive = true;
			} else {
				topic.isActive = false;
			}
			return topic;
		});

		setTopics(cloneTopics);
	};

	const EnterPhoneTic = (value) => {
		setPhoneTic(phoneTic + value);
	};

	const deletePhoneTic = () => {
		let clonePhoneTic = structuredClone(phoneTic);
		clonePhoneTic = clonePhoneTic.slice(0, -1);
		setPhoneTic(clonePhoneTic);
	};

	const saveTopicSelected = () => {
		let cloneTextUpdate = structuredClone(textUpdate);

		cloneTextUpdate.topic = topicSelected.name;
		cloneTextUpdate.topicId = topicSelected._id;
		setTextUpdate(cloneTextUpdate);
		setOpenModalTopic(false);
	};
	const savePhoneTic = (value) => {
		let cloneTextUpdate = structuredClone(textUpdate);
		cloneTextUpdate.attributes.spelling = value;
		cloneTextUpdate.spelling = value;

		setTextUpdate(cloneTextUpdate);
		setOpenModalPhoneTic(false);
	};

	const handleSaveUpdate = async () => {
		if (
			!textUpdate ||
			textUpdate.text === '' ||
			textUpdate.defind === ''
		)
			return ToastError(NOT_REQUIRED);
		try {
			closeModalBottom();
			const listText = JSON.parse(localStorage.getItem('listText'));
			setIsShow(true);
			await TextService.patchText(textUpdate);
			dispatch(SET_UPDATE_TEXT(textUpdate));
			setIsShow(false);
			ToastSuccess(UPDATE_SUCCESS);

			const newListText = listText.map((value) => {
				if (value._id === textUpdate.textId) {
					value.attributes = textUpdate.attributes;
					value.text = textUpdate.text;
					value.topicId = textUpdate.topicId;
					value.defind = textUpdate.defind;
				}
				return value;
			});
			localStorage.setItem('listText', JSON.stringify(newListText));

			setDisable(true);
		} catch (error) {
			console.log({ error });
			setIsShow(false);
			setDisable(true);
			ToastError(NOT_UPDATE);
		}
	};

	const handleData = async () => {
		const getData = JSON.parse(localStorage.getItem('textData')) ?? [];
		let allDataTextClone = getData;

		if (currentLevel != 'all') {
			allDataTextClone = allDataTextClone.filter(
				(value) => value.repeat == currentLevel
			);
		}
		if (currentTypeText != 'all') {
			allDataTextClone = allDataTextClone.filter(
				(value) => value.typeText == currentTypeText
			);
		}

		allDataTextClone = allDataTextClone.filter((value) => {
			return (
				dayjs(value.createdAt).format('YYYY-M') ==
				`${selectedYear}-${selectedMonth}`
			);
		});

		const dataFilterPage = await functionPagination(
			currentPage != tempCurrentPage ? currentPage : 1,
			allDataTextClone
		);

		setListData(dataFilterPage);
		setTotalText(allDataTextClone?.length ?? 0);
		setTotalPages(
			Math.ceil(allDataTextClone?.length / LIMIT_LIST_TEXT_OF_PAGE)
		);

		if (currentPage != tempCurrentPage) {
			setTempCurrentPage(currentPage);
		}
	};

	useEffect(() => {
		handleData();
	}, [
		selectedMonth,
		currentLevel,
		currentTypeText,
		selectedYear,
		currentPage,
	]);
	return (
		<>
			<div>
				<div className="filter-check flex justify-between pt-4 pb-2 h-[100px] ">
					<div className="filter-level">
						<div className="filter mb-2">
							<div className="flex justify-between">
								<div>
									<div className="bg-yellow-100 rounded-lg">
										<div className="text-sm px-1">
											<label for="level">Cấp độ</label>
										</div>
										<select
											id="level"
											className="bg-yellow-100 "
											value={currentLevel}
											onChange={(e) => {
												setCurrentLevel(e.target.value);
											}}
										>
											<option value="all">tất cả</option>
											<option value="1">1</option>
											<option value="2">2</option>
											<option value="3">3</option>
											<option value="4">4</option>
											<option value="5">5</option>
											<option value="6">6</option>
											<option value="7">7</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="filter-type">
						<div className="bg-yellow-100 rounded-lg">
							<div className="text-sm px-1">
								<label for="type">Phân loại</label>
							</div>
							<select
								id="type"
								className="bg-yellow-100 "
								value={currentTypeText}
								onChange={(e) => {
									setCurrentTypeText(e.target.value);
								}}
							>
								<option value="word">Từ</option>
								<option value="sentence">Câu</option>
								<option value="all">tất cả</option>
							</select>
						</div>
					</div>

					<div className="filter-date">
						<div className="flex">
							<div className="bg-yellow-100 rounded-l-lg">
								<div className="text-sm px-1">Tháng</div>
								<select
									id="cars"
									className="bg-yellow-100"
									value={selectedMonth}
									onChange={(e) => {
										setSelectedMonth(e.target.value);
									}}
								>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
									<option value="6">6</option>
									<option value="7">7</option>
									<option value="8">8</option>
									<option value="9">9</option>
									<option value="10">10</option>
									<option value="11">11</option>
									<option value="12">12</option>
								</select>
							</div>
							<div className="bg-yellow-100 rounded-r-lg">
								<div className="text-sm px-1">Năm</div>
								<select
									id="cars"
									className="bg-yellow-100 "
									value={selectedYear}
									onChange={(e) => {
										setSelectedYear(e.target.value);
									}}
								>
									<option value="2024">2024</option>
									<option value="2025">2025</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* pagination */}
			<div className="flex justify-between">
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
							disabled={isShow}
						/>
					</Stack>
				</div>
				<div className="font-medium px-2 bg-[#fefe8b] rounded w-fit flex justify-center items-center">
					<div>{`${
						(currentPage - 1) * LIMIT_LIST_TEXT_OF_PAGE +
						listData?.length
							? (currentPage - 1) * LIMIT_LIST_TEXT_OF_PAGE +
							  listData?.length
							: 0
					} / ${totalText ? totalText : 0}`}</div>
				</div>
			</div>

			{/* list word */}

			<SpinnerLoading show={isShow}>
				{isShow ? (
					<div className="w-full h-[300px]"></div>
				) : (
					<div className="wrapper-lists flex flex-col gap-3 pt-4 ">
						{listData?.length > 0 &&
							listData?.map((word, idx) => {
								return (
									<div
										key={idx}
										className="detail-list flex flex-col gap-2 bg-slate-100 shadow-md p-2 rounded-lg"
										onClick={() => handleShowModalDetail(word._id)}
									>
										<div className="detail-list__top flex justify-between">
											<div className="flex gap-2">
												<div className="flex items-center">
													<div
														className={` ${
															word.typeText === 'word'
																? 'type-word'
																: 'type-sentence'
														} px-2 w-fit rounded-lg `}
													>
														{word.typeText === 'word' ? 'Từ' : 'Câu'}
													</div>
												</div>

												{word.typeText === 'word' ? (
													<div className="font-bold">{word.text}</div>
												) : (
													<div className="font-bold">
														{word.attributes.structure}
													</div>
												)}
											</div>

											<div className="text-right min-w-[92px]">
												{dayjs(word.createdAt).format('DD-MM-YYYY')}
											</div>
										</div>
										<div className="detail-list__bottom flex justify-between">
											<div className="w-[85%]">
												{word.typeText === 'sentence' && (
													<div>{word.text}</div>
												)}
												<div className="translate">{word.defind}</div>
											</div>

											<div className="bg-[#EDC349] text-white p-1 h-fit text-xs align-center rounded-lg">
												Cấp {word.repeat}
											</div>
										</div>
									</div>
								);
							})}
					</div>
				)}
			</SpinnerLoading>

			<ModalBottom
				open={open}
				label={LABEL_EDIT}
				disable={disable}
				closeModalBottom={closeModalBottom}
				handleSaveUpdate={handleSaveUpdate}
			>
				<div className="flex h-full ">
					<div className="flex flex-col gap-4 mb-4 w-full rounded-xl">
						<div>
							<TextField
								id="outlined"
								color="warning"
								sx={{ background: '#fff' }}
								label={`Nhập ${
									textUpdate.typeText === 'word' ? 'từ' : 'câu'
								}...(bắt buộc)`}
								variant="outlined"
								size="normal"
								fullWidth
								value={textUpdate.text}
								onChange={(e) => handleSetTextUpdate('text', e)}
							/>
						</div>

						{textUpdate.typeText &&
							textUpdate.typeText === 'sentence' && (
								<div>
									<TextField
										id="outlined"
										color="warning"
										sx={{ background: '#fff' }}
										label="Cấu trúc câu (S + V + O)"
										variant="outlined"
										size="normal"
										fullWidth
										value={textUpdate.structure}
										onChange={(e) =>
											handleSetTextUpdate('structure', e)
										}
									/>
								</div>
							)}

						<div>
							<TextField
								id="outlined"
								color="warning"
								sx={{ background: '#fff' }}
								label="Cấu trúc câu (S + V + O)"
								variant="outlined"
								size="normal"
								fullWidth
								value={textUpdate.defind}
								onChange={(e) => handleSetTextUpdate('defind', e)}
							/>
						</div>

						{textUpdate.typeText && textUpdate.typeText === 'word' && (
							<div>
								<TextField
									id="outlined"
									color="warning"
									sx={{ background: '#fff' }}
									label="Phiên âm"
									variant="outlined"
									size="normal"
									fullWidth
									value={textUpdate.spelling}
									onFocus={handleShowModalPhoneTic}
								/>
							</div>
						)}
						<div>
							<div className="flex justify-between border border-black bg-white rounded p-2 w-full">
								<div className="flex items-center">
									<div className="text-lg font-meduim">Chủ đề:</div>
								</div>
								<div
									className="border p-2 min-w-[100px] text-center bg-sky-200 shadow-md rounded-lg font-meduim"
									onClick={handleShowModalTopic}
								>
									↗️ {textUpdate.topic}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ModalBottom>

			{/* Modal show topic và modal show phiên âm */}

			<ModalCustomTopic
				open={openModalTopic}
				label="️🎯 chủ đề thích hợp"
				onCancel={onCancel}
				topics={topics}
				chooseTopic={chooseTopic}
				saveTopicSelected={saveTopicSelected}
			/>
			<ModalCustomPhonetic
				open={openModalPhoneTic}
				label="️🎯Phiên âm"
				onCancel={onCancelModalPhoneTic}
				topics={topics}
				chooseTopic={chooseTopic}
				ClickButtonEnter={savePhoneTic}
				phoneTic={phoneTic}
				EnterPhoneTic={EnterPhoneTic}
				deletePhoneTic={deletePhoneTic}
			/>

			<Toaster />
		</>
	);
}

export default Word;

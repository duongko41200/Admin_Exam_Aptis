import React, { useEffect, useState } from 'react';
import {useSelector } from 'react-redux';
import { POINT_REPLACE, RES_DATA } from '@/Constant/global';
import ReadingBaseOne from '@/app/components/ReadingBase/ReadingBaseOne';
import FrameReadingResult from '@/app/components/FrameReadingResult/FrameReadingResult.jsx';

const TITLE = 0;
const DEAR_PERSON = 1;
const FOOT_FISH = 2;

const ResultTestReading = ({ resultReading, numberLession }) => {
	const testBankData = useSelector(
		(state) => state.testBankStore.testBankData
	);
	const isShowResult = useSelector(
		(state) => state.generalStore.isShowResult
	);
	// const [resReadingPartOne, setResReadingPartOne] = useState();
	const [resReadingPartFour, setResReadingPartFour] = useState();
	const [resReadingPartFive, setResReadingPartFive] = useState();
	const [contentPartOne, setContentPartOne] = useState(null);
	const [resReadingPartTwo, setResReadingPartTwo] = useState();
	const [resReadingPartThree, setResReadingPartThree] = useState();

	const [resultReadingFour, setResultReadingFour] = useState([]);

	useEffect(() => {
		if (testBankData.reading.part1.length <= 0) {
			// navigate('/');
			return;
		}
		const readingPartOne = testBankData.reading.part1[RES_DATA].data;
		const readingPartFour =
			testBankData.reading.part4[RES_DATA].data?.questions;
		const readingPartFive =
			testBankData.reading.part5[RES_DATA].data.questions;

		const readingPartTwo =
			testBankData.reading.part2[RES_DATA].data.questions;

		const readingPartThree =
			testBankData.reading.part3[RES_DATA].data.questions;

		///// results / datauser

		const resultReadingFourUser = readingPartFour.answerList.map(
			(item) => ({ ...item })
		);
		const subQuestionReadingFourUser = readingPartFour.subQuestion.map(
			(item) => ({ ...item })
		);

		if (resultReadingFourUser) {
			resultReadingFourUser.forEach((userItem) => {
				userItem.resultUser = [];
				userItem.resultSystem = [];

				subQuestionReadingFourUser.forEach((subItem) => {
					if (userItem.content === subItem.responseUser) {
						userItem.resultUser.push(subItem.content);
					}
					if (userItem.content === subItem.correctAnswer) {
						userItem.resultSystem.push(subItem.content);
					}
				});

				const isCorrect =
					userItem.resultUser.length === userItem.resultSystem.length &&
					userItem.resultUser.every((userAnswer) =>
						userItem.resultSystem.includes(userAnswer)
					);

				userItem.statusResult = isCorrect ? 'Correct' : 'Incorrect';
			});

			console.log({ resultReadingFourUser });
		}

		setResultReadingFour(resultReadingFourUser);
		setResReadingPartTwo(readingPartTwo);
		setResReadingPartThree(readingPartThree);

		setResReadingPartFour(readingPartFour);
		setResReadingPartFive(readingPartFive);
		// setResReadingPartOne(readingPartOne);
		setContentPartOne(readingPartOne?.questions);
	}, [testBankData]);

	const renderPartOne = () => (
		<FrameReadingResult>
			<ReadingBaseOne>
				{contentPartOne?.subQuestion.length > 0 &&
					contentPartOne?.subQuestion.map((item, index) => (
						<div
							key={index}
							className="flex justify-start gap-1 text-sm"
						>
							{item?.content.split(' ').map((word, idx) =>
								word !== POINT_REPLACE ? (
									<div key={idx}>{word}</div>
								) : (
									<span key={idx}>
										<select
											className={`font-medium w-fit text-[15px] ${
												item.responseUser === item.correctAnswer
													? 'text-green-700'
													: 'text-red-700'
											} ${
												!item.responseUser && 'bg-gray-200'
											} border border-gray-400 rounded-md p-1 w-20`}
											defaultValue={item.responseUser}
											disabled
										>
											<option
												value=""
												aria-label="Please select an option - "
											></option>
											{item.answerList.map((answer, idx) => (
												<option key={idx} value={answer.content}>
													{answer.content}
												</option>
											))}
										</select>
									</span>
								)
							)}
						</div>
					))}
			</ReadingBaseOne>
			{resultReading?.[0]?.part1 &&
				resultReading?.[0]?.part1.map((item, index) => (
					<div className="questions-wrapper" key={index}>
						<div className="question-wrapper flex gap-2">
							<div className="question-number">
								<strong className="rounded-full bg-[#e8f2ff] text-[#35509a] w-[40px] h-[40px] leading-[40px] text-[15px] text-center inline-block">
									{index + 1}
								</strong>
							</div>
							<div className="question-content">
								<div className="mt-2 text-success text-[#3cb46e] text-[15px]">
									{item.resultCorrect}
								</div>
							</div>
						</div>
					</div>
				))}
		</FrameReadingResult>
	);

	const renderPartTwo = () => (
		<FrameReadingResult>
			<div className="flex flex-col gap-4">
				<div className="text-[15px] font-medium">
					{resReadingPartTwo?.content.split(POINT_REPLACE)[TITLE]}
				</div>

				<div className="box-left p-4 w-full">
					<div className="w-full rounded flex flex-col gap-2 h-fit">
						<div className="w-full">
							<div className="font-inter text-[15px]">
								<strong>
									{
										resReadingPartTwo?.content.split(POINT_REPLACE)[
											DEAR_PERSON
										]
									}
								</strong>
							</div>
							<div className="mt-2">
								{
									resReadingPartTwo?.content.split(POINT_REPLACE)[
										FOOT_FISH
									]
								}
							</div>
						</div>
						{resultReading?.[1]?.part2?.[0]?.resultOfUser?.map(
							(content, index) => (
								<div
									className={` border rounded min-h-[50px] flex items-center justify-center cursor-move relative w-full bg-[#f4f7fc] border-dashed border-2 border-[#939393] p-2 text-[14px] mb-2 border border-gray-300 shadow rounded p-2 bg-gray-50 min-h-[50px] ${
										content?.id == index + 1
											? 'text-[#3cb46e] border-[#3cb46e]'
											: 'text-red-500 border-[#f44336]'
									} 
									
									`}
									key={index}
								>
									{content?.content}
								</div>
							)
						)}
					</div>
				</div>
			</div>
			{resultReading?.[1]?.part2?.[0]?.resultCorrect?.map(
				(item, index) => (
					<div className="questions-wrapper" key={index}>
						<div className="question-wrapper flex gap-2">
							<div className="question-number">
								<strong
									className={`rounded-full bg-[#e8f2ff] text-[#35509a] w-[40px] h-[40px] leading-[40px] text-[15px] text-center inline-block `}
								>
									{index + 1}
								</strong>
							</div>
							<div className="question-content">
								<div className="mt-2 text-success text-[#3cb46e] text-[15px]">
									{item?.content}
								</div>
							</div>
						</div>
					</div>
				)
			)}
		</FrameReadingResult>
	);

	const renderPartThree = () => (
		<FrameReadingResult>
			<div className="flex flex-col gap-4">
				<div className="text-[15px] font-medium">
					{resReadingPartThree?.content.split(POINT_REPLACE)[TITLE]}
				</div>

				<div className="box-left p-4 w-full">
					<div className="w-full rounded flex flex-col gap-2 h-fit">
						<div className="w-full">
							<div className="font-inter text-[15px]">
								<strong>
									{
										resReadingPartThree?.content.split(POINT_REPLACE)[
											DEAR_PERSON
										]
									}
								</strong>
							</div>
							<div className="mt-2">
								{
									resReadingPartThree?.content.split(POINT_REPLACE)[
										FOOT_FISH
									]
								}
							</div>
						</div>
						{resultReading?.[2]?.part3?.[0]?.resultOfUser?.map(
							(content, index) => (
								<div
									className={` border rounded min-h-[50px] flex items-center justify-center cursor-move relative w-full bg-[#f4f7fc] border-dashed border-2 border-[#939393] p-2 text-[14px] mb-2 border border-gray-300 shadow rounded p-2 bg-gray-50 min-h-[50px] ${
										content?.id == index + 1
											? 'text-[#3cb46e] border-[#3cb46e]'
											: 'text-red-500 border-[#f44336]'
									} 
								
								`}
									key={index}
								>
									{content?.content}
								</div>
							)
						)}
					</div>
				</div>
			</div>
			{resultReading?.[2]?.part3?.[0]?.resultCorrect?.map(
				(item, index) => (
					<div className="questions-wrapper" key={index}>
						<div className="question-wrapper flex gap-2">
							<div className="question-number">
								<strong
									className={`rounded-full bg-[#e8f2ff] text-[#35509a] w-[40px] h-[40px] leading-[40px] text-[15px] text-center inline-block `}
								>
									{index + 1}
								</strong>
							</div>
							<div className="question-content">
								<div className="mt-2 text-success text-[#3cb46e] text-[15px]">
									{item?.content}
								</div>
							</div>
						</div>
					</div>
				)
			)}
		</FrameReadingResult>
	);

	const renderPartFour = () => (
		<FrameReadingResult percentage={50}>
			{resReadingPartFour &&
				resReadingPartFour?.content
					?.split(POINT_REPLACE)
					.map((part, index) => (
						<div
							key={index}
							className="md:text-[14px] 2xl:text-[16px] leading-[1.7rem] mt-2"
						>
							{index % 2 === 0 || index === 1 ? (
								<strong>{part}</strong>
							) : (
								<div>
									{part}

									<div className="mt-2">
										<span className="font-bold text-[16px] mr-2 underline bg-[#e8f2ff] p-1">
											Đáp án của bạn:
										</span>

										<span
											className={` ${
												resultReadingFour[
													index == 3 ? 0 : (index - 3) / 2
												]?.statusResult === 'Correct'
													? 'text-[#3cb46e]'
													: 'text-red-500'
											}`}
										>
											{resultReadingFour[
												index == 3 ? 0 : (index - 3) / 2
											]?.resultUser.join(' / ')}
										</span>
									</div>
								</div>
							)}
						</div>
					))}
			{resultReadingFour &&
				resultReadingFour?.map((item, index) => (
					<div className="questions-wrapper" key={index}>
						<div className="question-wrapper flex gap-2">
							<div className="question-number">
								<strong className="rounded-full bg-[#e8f2ff] text-[#35509a] w-[40px] h-[40px] leading-[40px] text-[15px] text-center inline-block">
									{index + 1}
								</strong>
							</div>
							<div className="question-content">
								<div className="mt-2 text-success text-[#3cb46e] text-[15px]">
									<span className="text-gray-700 text-lg font-bold">
										{item?.content}
									</span>
									<u className="no-underline">
										{item.resultSystem &&
											item.resultSystem.map((item, index) => {
												return (
													<li
														key={index}
														className="text-green-500 text-none mt-2 no-underline text-sm"
													>
														{item}
													</li>
												);
											})}
									</u>
								</div>
							</div>
						</div>
					</div>
				))}
		</FrameReadingResult>
	);

	const renderPartFive = () => (
		<FrameReadingResult>
			{resReadingPartFive &&
				resReadingPartFive?.content
					?.split(POINT_REPLACE)
					.map((part, index) => (
						<div
							key={index}
							className="md:text-[14px] 2xl:text-[16px] leading-[1.7rem]"
						>
							{index >
								(part.split(POINT_REPLACE)[1] === 'null' ? 0 : 1) && (
								<div className="answer p-1 col-4 w-[200px]">
									<span data-lrn-template-response="">
										<span className="lrn_combobox">
											<input
												className={`min-w-[250px] border-2 bg-white border-black shadow rounded-md p-1 ${
													resReadingPartFive.subQuestion[
														index -
															(part.split(POINT_REPLACE)[1] === 'null'
																? 1
																: 2)
													]?.responseUser ===
													resReadingPartFive.subQuestion[
														index -
															(part.split(POINT_REPLACE)[1] === 'null'
																? 1
																: 2)
													]?.correctAnswer
														? 'border-green-500 text-green-500 font-medium'
														: ' font-medium border-red-500 text-red-500'
												}`}
												data-inputid="0"
												defaultValue={
													resReadingPartFive.subQuestion.length > 0 &&
													resReadingPartFive.subQuestion[
														index -
															(part.split(POINT_REPLACE)[1] === 'null'
																? 1
																: 2)
													]?.responseUser
												}
												disabled
											/>
										</span>
									</span>
								</div>
							)}
							{index === 1 || index === 0 ? (
								<strong>{part}</strong>
							) : (
								part
							)}
						</div>
					))}
			{resReadingPartFive &&
				resReadingPartFive?.subQuestion.map((item, index) => (
					<div className="questions-wrapper" key={index}>
						<div className="question-wrapper flex gap-2">
							<div className="question-number">
								<strong className="rounded-full bg-[#e8f2ff] text-[#35509a] w-[40px] h-[40px] leading-[40px] text-[15px] text-center inline-block">
									{index + 1}
								</strong>
							</div>
							<div className="question-content">
								<div className="mt-2 text-success text-[#3cb46e] text-[15px]">
									{item?.correctAnswer}
								</div>
							</div>
						</div>
					</div>
				))}
		</FrameReadingResult>
	);

	return (
		<div
		className="bg-[#f8f9fa] flex flex-col gap-10 md:w-[calc(100vw-var(--sidebar-width))]"
		style={{ "--sidebar-width": !isShowResult ? "270px" : "358px" }}
		>
			{numberLession === 1 && renderPartOne()}
			{numberLession === 2 && renderPartTwo()}
			{numberLession === 3 && renderPartThree()}
			{numberLession === 4 && renderPartFour()}
			{numberLession === 5 && renderPartFive()}
		</div>
	);
};

export default ResultTestReading;

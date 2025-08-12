import React, { useEffect, useRef, useState } from 'react';
import '../../Reading/ExamReading.css';
import { useDispatch, useSelector } from 'react-redux';
import { RES_DATA } from '@/Constant/global';
import {
	SET_ATTEMPTED_QUESTION,
	SET_RESPONSE_RESULT_LISTENING,
} from '@/store/feature/testBank';

const convertToWord = {
	1: 'A',
	2: 'B',
	3: 'C',
};

const ListeningPartOne = () => {
	const testBankData = useSelector(
		(state) => state.testBankStore.testBankData
	);
	const audioRef = useRef(null);

	const numberQuestionEachPart = useSelector(
		(state) => state.listeningStore.numberQuestionEachPart
	);

	// console.log('numberQuestionEachPart', numberQuestionEachPart);

	// const [resSpeakingPartOne, setResSpeakingPartOne] = useState();
	// const [contentPartOne, setContentPartOne] = useState();
	const [subQuestions, setSubQuestions] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);

	// const navigate = useNavigate();

	const dispatch = useDispatch();

	const handleClick = (item, index) => {
		console.log('item', item);
		console.log('index', index);

		dispatch(
			SET_RESPONSE_RESULT_LISTENING({
				part: 1,
				index: numberQuestionEachPart - 1,
				value: item.content,
				number: 0,
			})
		);
		dispatch(
			SET_ATTEMPTED_QUESTION({
				part: numberQuestionEachPart,
				numberQuestion: 1,
				currentExamPart: 'listening',
			})
		);
	};
	const toggleAudio = () => {
		if (audioRef.current.paused) {
			setIsPlaying(true);
			audioRef.current.play();
		} else {
			setIsPlaying(false);
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
	};

	useEffect(() => {
		setIsPlaying(false);
		audioRef.current.pause();
		audioRef.current.currentTime = 0;
		const ListeningPartOne = testBankData.listening.part1[RES_DATA];

		setSubQuestions(ListeningPartOne?.questions[RES_DATA].subQuestion);
	}, [testBankData, numberQuestionEachPart]);

	const handleAudioEnd = () => {
		setIsPlaying(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className=" mb-2">
				{subQuestions.length > 0 &&
					subQuestions[numberQuestionEachPart - 1].content}
			</div>
			<div
				onClick={toggleAudio}
				className="hover:underline cursor-pointer flex gap-2 items-center w-fit"
			>
				<div>
					{!isPlaying ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="size-6 stroke-2 w-[1.6rem] h-[1.6rem] "
						>
							<path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							<path d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="size-6 stroke-2 w-[1.6rem] h-[1.6rem] "
						>
							<path d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
					)}
				</div>
				<div className="text-lg">Play/Stop</div>
			</div>
			<audio
				ref={audioRef}
				className="hidden"
				key={subQuestions[numberQuestionEachPart - 1]?.file}
				onEnded={handleAudioEnd}
			>
				<source
					src={
						subQuestions[numberQuestionEachPart - 1]?.file
							? subQuestions[numberQuestionEachPart - 1]?.file
							: null
					}
					type="audio/mp3"
				/>
			</audio>
			<div className="flex flex-col gap-1">
				{subQuestions.length > 0 &&
					subQuestions[numberQuestionEachPart - 1].answerList.map(
						(item, index) => (
							<div
								className="flex h-[65px] w-full  border border-[#d4d4d4] cursor-pointer "
								key={index}
								onClick={() => {
									handleClick(item, index);
								}}
							>
								<div
									className={`text-[2rem] w-[4.5rem]  text-center h-full flex items-center border border-r-2 border-[#d4d4d4] justify-center ${
										subQuestions[numberQuestionEachPart - 1]
											?.responseUser === item.content
											? 'bg-[#fefac7]'
											: 'hover:bg-[#f8f9fa]'
									}`}
								>
									<div>{convertToWord[index + 1]}</div>
								</div>

								<div
									className={`w-full bg-[#eef0f3] p-[0.7rem] h-full flex items-center text-md  ${
										subQuestions[numberQuestionEachPart - 1]
											?.responseUser === item.content
											? 'bg-[#fefac7]'
											: 'hover:bg-[#f8f9fa]'
									}`}
								>
									<div>{item?.content}</div>
								</div>
							</div>
						)
					)}
			</div>
		</div>
	);
};

export default ListeningPartOne;

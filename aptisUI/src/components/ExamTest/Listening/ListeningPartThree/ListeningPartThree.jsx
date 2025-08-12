import React, { useEffect, useRef, useState } from 'react';
import '../../Reading/ExamReading.css';
import { useDispatch, useSelector } from 'react-redux';
import { RES_DATA } from '@/Constant/global';
import {
	SET_ATTEMPTED_QUESTION,
	SET_RESPONSE_RESULT_LISTENING,
} from '@/store/feature/testBank';

const ListeningPartThree = () => {
	const testBankData = useSelector(
		(state) => state.testBankStore.testBankData
	);
	const audioRef = useRef(null);
	const numberQuestionEachPart = useSelector(
		(state) => state.listeningStore.numberQuestionEachPart
	);

	// const [resSpeakingPartTwo, setResSpeakingPartTwo] = useState();
	const [contentPartTwo, setContentPartTwo] = useState();
	const [subQuestions, setSubQuestions] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	// const navigate = useNavigate();

	const dispatch = useDispatch();

	const selectOption = (e, index) => {
		dispatch(
			SET_RESPONSE_RESULT_LISTENING({
				part: 3,
				index: index,
				value: e.target.value,
				number: 0,
			})
		);

		dispatch(
			SET_ATTEMPTED_QUESTION({
				part: numberQuestionEachPart,
				numberQuestion: 3,
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
		if (testBankData.speaking.part1.length <= 0) {
			// navigate("/");
			return;
		}

		const ListeningPartThree = testBankData.listening.part3[RES_DATA];

		// setResSpeakingPartTwo(ListeningPartThree);
		setContentPartTwo(ListeningPartThree?.questions);

		setSubQuestions(
			ListeningPartThree?.questions[RES_DATA].subQuestion
		);
	}, [testBankData]);
	const handleAudioEnd = () => {
		setIsPlaying(false);
	};

	return (
		<div className="flex flex-col gap-4 ">
			<div className=" mb-2">
				{contentPartTwo &&
					contentPartTwo[RES_DATA] &&
					contentPartTwo[RES_DATA].content}
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
				key={contentPartTwo && contentPartTwo[RES_DATA]?.file}
				onEnded={handleAudioEnd}
			>
				<source
					src={
						contentPartTwo && contentPartTwo[RES_DATA]?.file
							? contentPartTwo[RES_DATA]?.file
							: null
					}
					type="audio/mp3"
				/>
			</audio>
			<div className="flex flex-col gap-6">
				<div className="font-medium">Who expresses which opinion?</div>
				{subQuestions.length > 0 &&
					subQuestions.map((item, index) => (
						<div
							className="flex h-[40px] w-full   cursor-pointer  "
							key={index}
						>
							<div className="w-fit   text-[15px] h-full flex items-center font-medium justify-start">
								<div>
									{index + 1}. {item.content}
								</div>
							</div>

							<div className="w-fit px-[0.8rem] flex items-center text-md ">
								<select
									aria-label="Response input area"
									className="lrn-cloze-select lrn_cloze_response  w-full font-medium"
									data-inputid="1"
									onChange={(e) => {
										selectOption(e, index);
									}}
									defaultValue={item.responseUser}
								>
									<option
										role="option"
										value=""
										aria-label="Please select an option - "
									></option>
									{contentPartTwo[RES_DATA] &&
										contentPartTwo[RES_DATA].answerList.map(
											(answer, idx) => (
												<option
													key={idx}
													role="option"
													value={answer.content}
												>
													{answer.content}
												</option>
											)
										)}
								</select>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default ListeningPartThree;

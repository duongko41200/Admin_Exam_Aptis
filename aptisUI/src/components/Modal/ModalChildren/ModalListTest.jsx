import { SET_NUMBER_QUESTION_LISTENING } from '../../../store/feature/listening';
import { SET_NUMBER_QUESTION_READING } from '../../../store/feature/reading';
import { SET_UPDATE_MODAL_LIST } from "../../../store/feature/testBank";
import { SET_NUMBER_QUESTION_WRITING } from "../../../store/feature/writing";
import { useDispatch } from 'react-redux';

export default function ModalListTest({dataOfModalList}) {
	const dispatch = useDispatch();

	const moveToQuestion = (item) => {
		if (item.currentExamPart === 'reading') {
			dispatch(SET_NUMBER_QUESTION_READING(item.questionPart.question));
			dispatch(
				SET_UPDATE_MODAL_LIST({
					numberQuestion: item.questionPart.question,
					currentExamPart: item.currentExamPart,
				})
			);
		}
		if (item.currentExamPart === 'writing') {
			dispatch(SET_NUMBER_QUESTION_WRITING(item.question));
			dispatch(
				SET_UPDATE_MODAL_LIST({
					numberQuestion: item.question,
					currentExamPart: item.currentExamPart,
				})
			);
		}

		if (item.numberQuestion?.currentExamPart === 'listening') {
			console.log('item.question', item);
			let numberQuestionPart = item.numberQuestionPart;

			const numberQuestion = item.numberQuestion.question;

			if (numberQuestion === 2) {
				numberQuestionPart = 13;
			}
			if (numberQuestion === 3) {
				numberQuestionPart = 14;
			}
			if (numberQuestion === 4) {
				numberQuestionPart = 15 + numberQuestionPart;
			}
			dispatch(SET_NUMBER_QUESTION_LISTENING(item));
			dispatch(
				SET_UPDATE_MODAL_LIST({
					numberQuestion: numberQuestionPart + 1,
					currentExamPart: item.numberQuestion.currentExamPart,
				})
			);
		}
	};

	return (
		<div className="mt-4 w-full flex flex-col gap-4">
			{dataOfModalList?.numberQuestion?.map((item, index) => (
				<>
					{item && item?.currentExamPart === 'reading' && (
						<div
							className={`w-full flex flex-col  border border-[#e5e5e5] p-2 rounded-[6px] ${
								item.questionPart.activeQuestion
									? 'bg-[#c3c1ddc4]'
									: 'hover:bg-[#e7e6f1] cursor-pointer'
							}  `}
							key={index}
							onClick={() => moveToQuestion(item)}
						>
							<div className="text-md font-bold">0{item.question}</div>
							<div className="w-full flex justify-between items-center text-sm">
								<div>
									{item.questionPart.isWatching ? 'Seen' : 'Unseen'}
								</div>
								<div>
									{item.questionPart.status
										? 'Attempted'
										: 'Not Attempted'}
								</div>
							</div>
						</div>
					)}

					{item && item?.currentExamPart === 'writing' && (
						<div className="w-full flex flex-col border border-[#e5e5e5] rounded-[6px]">
							<div className="w-full flex flex-col gap-1 rounded-[6px]">
								<div
									className={`w-full flex justify-between items-center  p-2 rounded-[6px] ${
										item.activeQuestion
											? 'bg-[#c3c1ddc4]'
											: 'hover:bg-[#e7e6f1] cursor-pointer'
									}  `}
									key={index}
									onClick={() => moveToQuestion(item)}
								>
									<div>
										<div className="text-md font-bold">
											0{item.question}
										</div>
										<div className="w-full flex justify-between items-center text-sm">
											<div>{item?.numberPart} Parts</div>
										</div>
									</div>
									<div className="p-2 w-[24px] h-[24px] border border-[#0000001f] flex justify-center items-center rounded-[4px] cursor-pointer hover:bg-[#f4f4f5] hover:bg-[#e7e6f1] bg-[#c3c1dd] shadow-[inset 0 0 10px rgba(0, 8, 206, 0.25)]">
										<div>-</div>
									</div>
								</div>
								<div className="w-full flex flex-col gap-2 p-2 ">
									{item.questionPart.map((data, idx) => {
										return (
											<div
												className={`w-full flex flex-col   border border-[#e5e5e5] p-2 rounded-[6px] p-2 hover:bg-[#e7e6f1] cursor-pointer   `}
												key={idx}
												onClick={() => moveToQuestion(item)}
											>
												<div className="text-md font-bold">
													Part {data.question}
												</div>
												<div className="w-full flex justify-between items-center text-sm">
													<div>
														{data.isWatching ? 'Seen' : 'Unseen'}
													</div>
													<div>
														{data.status
															? 'Attempted'
															: 'Not Attempted'}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}

					{item && item?.currentExamPart === 'listening' && (
						<div className="w-full flex flex-col border border-[#e5e5e5] rounded-[6px]">
							<div className="w-full flex flex-col gap-1 rounded-[6px]">
								<div
									className={`w-full flex justify-between items-center  p-2 rounded-[6px] ${
										item.activeQuestion
											? 'bg-[#c3c1ddc4]'
											: 'hover:bg-[#e7e6f1] cursor-pointer'
									}  `}
									key={index}
									// onClick={() => moveToQuestion(item)}
								>
									<div>
										<div className="text-md font-bold">
											0{item.question}
										</div>
										<div className="w-full flex justify-between items-center text-sm">
											<div>{item?.numberPart} Parts</div>
										</div>
									</div>
									<div className="p-2 w-[24px] h-[24px] border border-[#0000001f] flex justify-center items-center rounded-[4px] cursor-pointer hover:bg-[#f4f4f5] hover:bg-[#e7e6f1] bg-[#c3c1dd] shadow-[inset 0 0 10px rgba(0, 8, 206, 0.25)]">
										<div>-</div>
									</div>
								</div>
								<div className="w-full flex flex-col gap-2 p-2 ">
									{item?.questionPart?.map((data, idx) => {
										return (
											<div
												className={`w-full flex flex-col   border border-[#e5e5e5] p-2 rounded-[6px] p-2 hover:bg-[#e7e6f1] cursor-pointer  ${
													data.activeQuestion
														? 'bg-[#c3c1ddc4]'
														: 'hover:bg-[#e7e6f1] cursor-pointer'
												}   `}
												key={idx}
												onClick={() =>
													moveToQuestion({
														numberQuestion: item,
														numberQuestionPart: idx,
													})
												}
											>
												<div className="text-md font-bold">
													Part {data.question}
												</div>
												<div className="w-full flex justify-between items-center text-sm">
													<div>
														{data.isWatching ? 'Seen' : 'Unseen'}
													</div>
													<div>
														{data.status
															? 'Attempted'
															: 'Not Attempted'}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</>
			))}
		</div>
	);
}

import React from 'react';
import { useSelector } from 'react-redux';
const ModalCountDown = ({
	seconds,
	finishRecording,
	isDisabled,
	isSpeakingTaiLieu,
	handleRecord,
	isRecord,
	currentSkillName,
}) => {
	const currentPartName = useSelector(
		(state) => state.taiLieuStore.currentPartName
	);
	const { isShowFullQuestion } = useSelector(
		(state) => state.taiLieuStore
	);
	return (
		<div
			className="flex justify-center items-center fixed right-2 top-4 p-1"
			style={{ height: 'calc(100vh - 100px)', width: 'fit-content' }}
		>
			<div className="w-[200px] sm:w-[200px] md:w-[300px] xl:w-[330px] p-5 rounded-3xl flex flex-col items-center justify-between shadow-[0_0_20px_2px_#cbcdf4] h-full">
				{/* Instruction Text */}
				<div className="text-center w-full flex justify-center items-center flex-col ">
					<h5 className="mt-2 mb-5 font-bold text-2xl">
						Instructions...
					</h5>

					{/* Circle Button */}
					<button className=" md:w-[180px] xl:w-[180px]  md:h-[180px] xl:h-[180px] rounded-full bg-white shadow-[0_0_26px_#1507b729] flex items-center justify-center hover:bg-white">
						<div className="m-0 text-[#161616] font-medium text-[4em]">
							<span>{seconds.toString().padStart(1, '0')}</span>
						</div>
					</button>
				</div>

				{/* Bottom Button */}

				{isSpeakingTaiLieu && (
					<div
						className={` absolute ${isRecord ? 'animate-pulse-border' : ''}  ${currentPartName === 2 || currentPartName === 3 ? 'bottom-[8rem]' : 'bottom-[6rem]'} left-[50%] cursor-pointer  transform -translate-x-1/2 translate-y-1/2 mt-4 ${!isRecord ? 'bg-[#512da8] border-violet-900' : 'bg-red-700 border-red-900'} text-white text-base rounded-full flex justify-center items-center h-[60px] w-[60px] border-2 disabled:bg-gray-300 disabled:opacity-50 disabled:text-gray-400 shadow-[0_0_20px_2px_#cbcdf4] ${isSpeakingTaiLieu && (isShowFullQuestion || currentSkillName != 'speaking') ? 'hidden' : ''}`}
						onClick={handleRecord}
					>
						{!isRecord ? (
							<div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="h-8 w-8"
								>
									<path d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
								</svg>
							</div>
						) : (
							<div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="h-8 w-8"
								>
									<path d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
								</svg>
							</div>
						)}
					</div>
				)}
				<button
					className={`mt-4 bg-[#512da8] text-white text-base rounded-lg w-full h-[50px] hover:bg-[#673ab7] disabled:bg-gray-300 disabled:opacity-50 disabled:text-gray-400 shadow-[0_0_20px_2px_#cbcdf4] ${isSpeakingTaiLieu && (currentPartName === 1 || currentPartName === 4 || isShowFullQuestion) ? 'hidden' : ''}`}
					onClick={finishRecording}
					disabled={!isDisabled}
				>
					Finish Recording
				</button>
			</div>
		</div>
	);
};

export default ModalCountDown;

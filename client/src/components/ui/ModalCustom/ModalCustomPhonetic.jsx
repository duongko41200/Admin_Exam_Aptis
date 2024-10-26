import React, { useEffect, useState } from 'react';
import { UilTimes } from '@iconscout/react-unicons';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField } from '@mui/material';
import KeyBoardPhoneTic from '../KeyBoard/KeyBoardPhoneTic';

function ModalCustomPhonetic({
	onCancel,
	open,
	label,
	ClickButtonEnter,
	phoneTic,
	EnterPhoneTic,
	deletePhoneTic,
}) {
	return (
		<>
			{open && (
				<motion.div
					animate={
						open
							? { opacity: 0.7, zIndex: 10 }
							: { opacity: 0, display: 'none' }
					}
					transition={{
						duration: 0.2,
					}}
					initial={{ opacity: 0 }}
					className="fixed top-0 bottom-0 left-0 h-screen w-screen bg-black"
					// onClick={closeModalBottom}
				/>
			)}
			{open && (
				<AnimatePresence>
					{open && (
						<div className="w-[100%] fixed top-0 left-0 flex justify-center items-center px-4 h-full z-10">
							<motion.div
								key="content"
								initial={{ scale: 0.3 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								transition={{
									duration: 0.2,
								}}
								className="border-gray-50 w-full rounded-2xl border-3 z-10 border-b-0 bg-white shadow-[0px_-8px_20px_-6px_rgba(0,0,0,0.3)]"
							>
								<div className="h-[90%] px-4 pt-2">
									<div className="flex justify-between">
										<div></div>

										<div className="text-gray-400 text-md italic">
											{label}
										</div>
										<div
											className="mb-2 flex justify-end"
											onClick={onCancel}
										>
											<UilTimes />
										</div>
									</div>
								</div>

								<div className="">
									<div className="h-full flex flex-col min-h-[150px] max-h-[350px] overflow-auto h-fit px-2 py-4 bg-[#eef5bd6c] rounded-b-2xl">
										<div>
											<TextField
												id="outlined"
												color="warning"
												sx={{
													background: '#fff',
													'& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input':
														{
															letterSpacing: '1px',
														},
												}}
												label="Phiên âm"
												variant="outlined"
												size="normal"
												fullWidth
												disabled
												value={phoneTic}
												// onChange={(e) => handleSetTextUpdate('spelling', e)}
											/>
										</div>

										<KeyBoardPhoneTic
											ClickButtonEnter={() =>
												ClickButtonEnter(phoneTic)
											}
											deletePhoneTic={deletePhoneTic}
											phoneTic={phoneTic}
											EnterPhoneTic={EnterPhoneTic}
										/>

										{/* <div className="grid grid-cols-3 w-full h-fit gap-2 pb-2">
											{topics &&
												topics.map((topic, idx) => {
													return (
														<div
															key={idx}
															className={`p-2  text-center h-fit w-full text-center border text-md w-fit rounded shadow ${
																topic.isActive
																	? 'bg-sky-200'
																	: 'bg-white'
															} `}
															onClick={() => chooseTopic(topic)}
														>
															{topic.name}
														</div>
													);
												})}
										</div> */}
									</div>
								</div>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			)}
		</>
	);
}

export default ModalCustomPhonetic;

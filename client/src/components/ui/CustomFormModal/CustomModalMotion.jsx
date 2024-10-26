import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UilTimes } from '@iconscout/react-unicons';
function CustomModalMotion({
	open,
	closeModalBottom,
	label,
	children,
	disable,
	handleSaveUpdate,
	showRefresh = false,
	showButtonSave = true,
	padding = 4,
	bgcolor = '#fde0476c',
}) {
	return (
		<>
			<motion.div
				animate={
					open
						? { opacity: 0.5, zIndex: 1 }
						: { opacity: 0, display: 'none' }
				}
				initial={{ opacity: 0 }}
				className="fixed top-0 bottom-0 left-0 h-screen w-screen bg-gray-700"
				onClick={closeModalBottom}
			/>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						key="content"
						initial="collapsed"
						animate="open"
						exit="collapsed"
						variants={{
							open: { y: 0, height: 'fit-content' },
							collapsed: { y: '100%', height: 0 },
						}}
						transition={{
							duration: 0.2,
							ease: [0.04, 0.62, 0.23, 0.98],
						}}
						className="border-gray-50 fixed bottom-0 h-fit right-0 left-0 x-10 w-full rounded-t-xl border-3 z-10 border-b-0 bg-white shadow-[0px_-8px_20px_-6px_rgba(0,0,0,0.3)]"
					>
						<div className="px-4 pt-2">
							<div className="flex justify-between mb-2">
								<div></div>

								<div className="text-gray-400 text-xl italic">
									{label}
								</div>
								<div
									className="mb-2 flex justify-end"
									onClick={closeModalBottom}
								>
									<UilTimes />
								</div>
							</div>

							<div>
								<div
									className={`h-full flex flex-col min-h-[500px] max-h-[550px] overflow-auto  p-${padding} bg-[${bgcolor}]`}
								>
									{children}

									<div className="mt-4 flex justify-between">
										{showRefresh && (
											<div
												className="border min-w-[80px] fit-w py-2 text-center rounded shadow-md font-bold bg-white border-black "
												// onClick={handlePrevious}
											>
												Refresh
											</div>
										)}

										{showButtonSave && (
											<div
												className={`border min-w-[80px] py-2 text-center rounded font-bold bg-white border-black shadow-md ${
													disable ? 'opacity-40' : ''
												}`}
												onClick={handleSaveUpdate}
											>
												SAVE
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default CustomModalMotion;

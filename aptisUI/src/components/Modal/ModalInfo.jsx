import { memo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { contentInfoModal } from '../../consts/review';
import { SET_IS_MODAL_INFO } from '../../store/general';

const ModalInfo = ({ currentExamPart }) => {
	const dispatch = useDispatch();

	const { isModalInfo } = useSelector((state) => state.generalStore);

	const closeModelList = () => {
		dispatch(SET_IS_MODAL_INFO(false));
	};

	return (
		<div>
			{isModalInfo && (
				<div>
					<div
						className=" fixed top-[0.675rem] left-[0.675rem] w-[21rem] md:w-[20rem] 2xl:w-[30rem] h-[calc(100%-0.675rem*3-3.75rem)] 
  bg-white border border-[#f8f8f8] shadow-[0_0_20px_2px_var(--primary-100,#cbcdf4)] 
  rounded-md p-[0.675rem] overflow-auto overflow-x-hidden z-[1000] bg-gray-50"
					>
						<div className="w-full mb-[2rem] h-[45px] flex justify-between items-center">
							<div className="text-2xl text-[#161616]  sans-serif  text-[#161616] font-bold">
								Infomation
							</div>
							<div
								className="w-[50px] h-[50px] border border-[#0000001f] flex justify-center items-center rounded-[6px] cursor-pointer hover:bg-[#f4f4f5]"
								onClick={closeModelList}
							>
								<div className="text-xl font-medium">X</div>
							</div>
						</div>
						<div className="flex flex-col gap-4">
							<div className="flex justify-between gap-4 rounded-lg border border-black border-dashed dark:border-dark-strokes font-sans p-4 shadow-sm text-gray-900 text-lg uppercase ">
								{currentExamPart && <div> {currentExamPart} </div>}
							</div>
							<div className="flex justify-between gap-4 rounded-lg border border-black border-dashed dark:border-dark-strokes p-4 font-sans shadow-sm text-gray-600 text-md">
								<div
									className="m-0"
									dangerouslySetInnerHTML={{
										__html: contentInfoModal[currentExamPart],
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(ModalInfo);

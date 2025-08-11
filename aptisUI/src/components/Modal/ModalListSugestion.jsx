import { memo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { SET_MODAL_LIST_SUGESTION } from '../../store/general';

import ModalSuggestDoc from './ModalChildren/ModalSuggestDoc';
import ModalSuggestTest from './ModalChildren/ModalSuggestTest';

const styleIsZoom = `flex justify-center items-center w-full h-[calc(100%-0.675rem*3-3.75rem)] z-[1000]  fixed top-0 left-0 bg-gray-100 bg-opacity-50 z-50`;
const styleIsAtrZoom = `fixed top-[0.675rem] left-[0.675rem] md:w-[24rem]`;
const ModalListSugestion = ({ currentExamPart, typeZoom = 'doc' }) => {
	const dispatch = useDispatch();

	const { isModalListSugestion } = useSelector(
		(state) => state.generalStore
	);

	const isZoomSuggestion = useSelector(
		(state) => state.generalStore.isZoomSuggestion
	);

	const closeModelList = () => {
		dispatch(SET_MODAL_LIST_SUGESTION(false));
	};

	return (
		<div>
			{isModalListSugestion && (
				<div className={isZoomSuggestion ? styleIsZoom : ''}>
					<div
						className={` ${
							isZoomSuggestion
								? 'max-w-[50rem] 2xl:max-w-[70rem] px-4  '
								: ` w-[21rem] 2xl:w-[30rem] ${styleIsAtrZoom}`
						} h-[calc(100%-0.675rem*3-3.75rem)]
  bg-white border border-[#f8f8f8] shadow-[0_0_20px_2px_var(--primary-100,#cbcdf4)] 
  rounded-md p-[0.675rem] overflow-auto overflow-x-hidden z-[1000]`}
					>
						<div className="w-full mb-[2rem] h-[45px] flex justify-between items-center">
							<div className="text-2xl text-[#161616] sans-serif  text-[#161616] font-bold">
								Gợi ý của : {currentExamPart}
							</div>
							<div
								className="w-[50px] h-[50px] border border-[#0000001f] flex justify-center items-center rounded-[6px] cursor-pointer hover:bg-[#f4f4f5]"
								onClick={closeModelList}
							>
								<div className="text-xl font-medium">X</div>
							</div>
						</div>
						{typeZoom != 'doc' && (
							<ModalSuggestTest currentExamPart={currentExamPart} />
						)}
						{typeZoom == 'doc' && (
							<ModalSuggestDoc currentExamPart={currentExamPart} />
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(ModalListSugestion);

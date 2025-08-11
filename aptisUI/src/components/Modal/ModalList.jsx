import { SET_MODAL_LIST } from '../../store/general';
import { useDispatch, useSelector } from 'react-redux';
import ModalListTest from './ModalChildren/ModalListTest';
import ModalListDoc from './ModalChildren/ModalListDoc';

export default function ModalList({ open, typeZoom = 'doc' }) {
	const dispatch = useDispatch();

	const dataOfModalList = useSelector(
		(state) => state.testBankStore.dataOfModalList
	);

	const closeModelList = () => {
		dispatch(SET_MODAL_LIST(false));
	};
	return (
		<div>
			{open && (
				<div>
					<div className="fixed top-[0.675rem] left-[0.675rem] w-[21rem] h-[calc(100%-0.675rem*3-3.75rem)] bg-white border border-[#f8f8f8] shadow-[0_0_20px_2px_var(--primary-100,_#cbcdf4)] rounded-md p-4 overflow-auto overflow-x-hidden  z-[1000]">
						<div className="w-full mb-[2rem] h-[45px] flex justify-between items-center">
							<div className="text-lg font-medium text-[#161616]">
								Question List
							</div>
							<div
								className="w-[50px] h-[50px] border border-[#0000001f] flex justify-center items-center rounded-[6px] cursor-pointer hover:bg-[#f4f4f5]"
								onClick={closeModelList}
							>
								<div className="text-xl font-medium">X</div>
							</div>
						</div>
						<div className="w-full mb-[1rem] mi-h-[45px] flex flex-col items-center border border-[#e5e5e5] rounded-[6px] p-2 ">
							<div className="w-full flex justify-between items-center ">
								<div>
									<div className="text-md font-bold text-[#161616]">
										{dataOfModalList?.currentExamPart?.toUpperCase()}
									</div>
									<div className="text-sm  text-[#161616]">
										{dataOfModalList?.totalPart} Questions
									</div>
								</div>

								<div>
									<div className="p-2 w-[24px] h-[24px] border border-[#0000001f] flex justify-center items-center rounded-[4px] cursor-pointer hover:bg-[#f4f4f5] hover:bg-[#e7e6f1] bg-[#c3c1dd] shadow-[inset 0 0 10px rgba(0, 8, 206, 0.25)]">
										<div>-</div>
									</div>
								</div>
							</div>
							{typeZoom != 'doc' && (
								<ModalListTest dataOfModalList={dataOfModalList} />
							)}
							{typeZoom == 'doc' && <ModalListDoc />}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

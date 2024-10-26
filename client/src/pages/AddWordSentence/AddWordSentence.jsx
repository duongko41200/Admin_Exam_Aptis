import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { RESET_WORD, SET_TYPE_TEXT } from '../../store/feature/word';
import { toast, Toaster } from 'react-hot-toast';

function AddWordSentence() {
	const navigate = useNavigate();
	// const typeText = useSelector((state) => state.wordStore.typeText);

	const dispatch = useDispatch();

	const chooseWord = (typeText) => {
		dispatch(SET_TYPE_TEXT(typeText));
		navigate('/formWord/step1');
	};
	useEffect(() => {
		dispatch(RESET_WORD());
	}, [])
	
	

	return (
		<>
			<div className="w-full flex flex-col gap-10 h-[400px] p-2 pt-10">
				<div className="flex justify-center">
					<div className="flex flex-col gap-2 pt-10">
						<div onClick={() => chooseWord('word')}>
							<div className="border flex justify-center  items-center min-w-[350px]  min-h-[120px] p-2 text-center text-4xl border border-4 font-medium bg-bnt-word rounded shadow-md">
								<div>Từ</div>
							</div>
						</div>

						<div onClick={() => chooseWord('sentence')}>
							<div className="border flex justify-center border border-4  items-center min-w-[350px]  min-h-[120px] p-2 text-center text-4xl font-medium bg-btn-sentence rounded shadow-md">
								<div>Câu</div>
							</div>
						</div>

						<div className="pt-10 text-lg italic font-medium  text-orange-400">
							*Hãy chọn vào thứ bạn muốn học
						</div>
					</div>
				</div>
				<Toaster />
			</div>
		</>
	);
}

export default AddWordSentence;

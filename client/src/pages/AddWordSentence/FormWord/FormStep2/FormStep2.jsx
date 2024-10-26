import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_WORD } from '../../../../store/feature/word';

function FormStep2() {
	const [defind, setDefind] = useState('');

	const wordText = useSelector((state) => state.wordStore.wordObject);
	const dispatch = useDispatch();
	const handleSetText = (e) => {
		setDefind(e.target.value);
		// setWords((word) => {
		// 	return {...word, text: e.target.value};
		// });
		dispatch(SET_WORD({ defind: e.target.value }));
	};

	useEffect(() => {
		setDefind(wordText.defind)
	},[])
	return (
		<div className="w-ful flex justify-center">
			<div className="flex flex-col gap-10">
				<div className="text-center text-orange-400 font-medium">
					Nghĩa của từ vừa bạn nhập là gì vậy😽
				</div>
				<div>
					<input
						type="text"
						className="border border-black rounded p-2 w-full"
						placeholder="Nhập nghĩa từ..."
						value={defind}
						onChange={handleSetText}
					/>
				</div>
			</div>
		</div>
	);
}

export default FormStep2;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_WORD } from '../../../../store/feature/word';

function FormStep1() {
	const [text, setText] = useState('');
	const [structure, setStructure] = useState('');

	const wordText = useSelector((state) => state.wordStore.wordObject);
	const typeText = useSelector((state) => state.wordStore.typeText);
	const dispatch = useDispatch();

	const handleSetText = (e) => {
		setText(e.target.value);

		dispatch(SET_WORD({ text: e.target.value }));
	};

	const handleSetStructure = (e) => {
		setStructure(e.target.value);

		dispatch(SET_WORD({ attributes: { structure: e.target.value } }));
	};
	useEffect(() => {
		setText(wordText.text);
		setStructure(wordText?.attributes?.structure)
	}, []);
	return (
		<div className="w-ful flex justify-center">
			<div className="flex flex-col gap-10">
				<div className="text-center text-orange-400 font-medium">
					Nhập từ mà bạn muốn ghi nhớ 😽
				</div>
				<div className="flex flex-col gap-4">
					<div>
						<input
							type="text"
							className="border border-black rounded p-2 w-full"
							value={text}
							onChange={handleSetText}
							placeholder={`Nhập ${
								typeText === 'word' ? 'từ' : 'câu'
							}...(bắt buộc)`}
						/>
					</div>

					{typeText && typeText === 'sentence' && (
						<div>
							<input
								type="text"
								className="border border-black rounded p-2 w-full"
								value={structure}
								onChange={handleSetStructure}
								placeholder="Cấu trúc câu (S + V + O)"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default FormStep1;

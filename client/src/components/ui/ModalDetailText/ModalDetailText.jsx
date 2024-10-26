import React, { useEffect, useRef, useState } from 'react';
import {
	UilEdit,
	UilTrashAlt,
	UilTimes,
	UilVolume,
	UilVolumeMute,
} from '@iconscout/react-unicons';
import { useDispatch } from 'react-redux';
import { SET_OPEN_MODAL_BOTTOM } from '../../../store/general';
import OtherService from '../../../services/API/otherService.service';
import { RES_DATA } from '../../../Constant/global';

function ModalDetailText({
	openModalDetailText,
	onCancel,
	textDetail,
	deleteTextById,
}) {
	const [show, setShow] = useState(false);
	const [textVoice, setTextVoice] = useState('');
	let voices = window.speechSynthesis.getVoices();

	const dispatch = useDispatch();
	const audioRef = useRef(null);

	const OpenModalEdit = () => {
		dispatch(SET_OPEN_MODAL_BOTTOM(true));
		onCancel();
	};

	function findFemaleVoice(voices, value) {
		let femaleVoice = voices.find(
			(voice) => voice.name.toLowerCase() == value.name.toLowerCase()
		);
		if (femaleVoice) {
			return femaleVoice;
		} else {
			console.warn(
				'Giọng nói nữ không tìm thấy. Sẽ sử dụng giọng nói mặc định.'
			);
			return voices[4]; // Trả về giọng nói đầu tiên nếu không tìm thấy giọng nói nữ
		}
	}

	const handleVolumeClick = () => {
		let speech = new SpeechSynthesisUtterance();
		// window.speechSynthesis.cancel();

		speech.lang = 'en';
		speech.text = textDetail.text;
		speech.volume = 1;
		// speech.voice = 1;
		speech.rate = 1.1;
		speech.pitch = 1;

		console.log({ voices });

		let selectedVoice = findFemaleVoice(voices, { name: 'Mei-Jia' });

		speech.voice = selectedVoice;

		window.speechSynthesis.speak(speech);
	};

	const chargeVoices = (value) => {
		let speech = new SpeechSynthesisUtterance();
		// window.speechSynthesis.cancel();

		speech.lang = 'en';
		speech.text = textDetail.text;
		speech.volume = 1;
		// speech.voice = 1;
		speech.rate = 1;
		speech.pitch = 1;

		console.log({ voices });

		let selectedVoice = findFemaleVoice(voices, value);

		speech.voice = selectedVoice;

		window.speechSynthesis.speak(speech);
	};
	const handleRemove = () => {
		deleteTextById();
		onCancel();
	};

	useEffect(() => {
		setShow(openModalDetailText);
		console.log({ textDetail });
	}, [openModalDetailText]);

	return (
		<>
			{show && (
				<div className="absolute w-full h-full top-0 flex justify-center">
					<div className="w-full absolute z-9  h-full bg-gray-300 fixed opacity-40"></div>

					<div
						className="w-[90%] fixed top-0 flex items-center h-full p-4"
						// onClick={onCancel}
					>
						<div className="bg-white z-10 shadow-md w-full rounded-xl h-fit flex flex-col gap-4 p-4">
							<div className="p-2 w-full flex justify-between bg-white px-4">
								<div
									className="font-bold text-white bg-gray-400 p-1.5 rounded-lg"
									onClick={onCancel}
								>
									<UilTimes />
								</div>
								<div className="flex gap-4">
									<div
										onClick={handleRemove}
										className="bg-yellow-300 p-1.5 rounded-lg shadow-md"
									>
										<UilTrashAlt />
									</div>
									<div
										onClick={OpenModalEdit}
										className="bg-yellow-300 p-1.5 rounded-lg shadow-md"
									>
										<UilEdit />
									</div>

									<div
										onClick={handleVolumeClick}
										className="bg-yellow-300 p-1.5 rounded-lg shadow-md"
									>
										<UilVolume />
									</div>
								</div>
							</div>
							<div className="w-full h-[75%] shadow-md bg-[#fef9c373]">
								<div className="body min-h-[200px] p-4 rounded-4xl leading-8">
									{textDetail?.typeText === 'word' ? (
										<>
											<div>Từ: {textDetail.text}</div>
											<div>Nghĩa : {textDetail.defind}</div>
											<div>Chủ để: {textDetail?.topicId?.name}</div>
											<div>Cấp độ : {textDetail.repeat}</div>
										</>
									) : (
										<>
											<div>Câu: {textDetail.text}</div>
											<div>
												Cấu trúc: {textDetail.attributes.structure}
											</div>
											<div>Nghĩa : {textDetail.defind}</div>
											<div>Chủ để: {textDetail?.topicId?.name}</div>
											<div>Cấp độ : {textDetail.repeat}</div>
										</>
									)}
								</div>

								{/* <div style={{ maxHeight: '150px', overflow: 'auto' }}>
									{voices &&
										voices.map((value) => {
											return (
												<div onClick={() => chargeVoices(value)}>
													{value.name}
												</div>
											);
										})}
								</div> */}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default ModalDetailText;

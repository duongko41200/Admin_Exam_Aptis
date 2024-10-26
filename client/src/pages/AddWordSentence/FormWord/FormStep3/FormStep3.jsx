import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TopicService from '../../../../services/API/topic.service';
import { RES_DATA } from '../../../../Constant/global';
import { SET_WORD } from '../../../../store/feature/word';

function FormStep3() {
	const dispatch = useDispatch();
	const [topics, setTopics] = useState([]);
	const [date, setDate] = useState(new Date());

	const getAllTopics = async () => {
		let topicLocalStorage = [];

		try {
			const resTopic = await TopicService.getAllTopic();

			console.log({ resTopic });

			const resMetadata = resTopic[RES_DATA]?.metadata;
			topicLocalStorage = resMetadata.map((topic) => {
				topic = {
					_id: topic._id,
					name: topic.name,
					numberCount: 0,
					listElement: [],
					day: date.getDate(),
				};

				return topic;
			});

			let topicActive = topicLocalStorage.map((topic) => {
				topic['isActive'] = false;

				return topic;
			});
			localStorage.setItem('topics', JSON.stringify(topicLocalStorage));
			setTopics(topicActive);
		} catch (error) {
			console.log({ error });
		}
	};

	useEffect(() => {
		let currentDate = new Date();

		const topicLocalStorage = JSON.parse(
			localStorage.getItem('topics')
		);

		if (
			topicLocalStorage != null
			// topicLocalStorage[0].day != undefined
			// topicLocalStorage[0].day === currentDate.getDate()
		) {
			let topicActive = topicLocalStorage.map((topic) => {
				topic['isActive'] = false;

				return topic;
			});
			setTopics(topicActive);

		} else {
			getAllTopics();
		}
	}, []);

	const chooseTopic = (topicId) => {
		let topicCopy = topics;

		topicCopy = topicCopy.map((topic) => {
			if (topic._id === topicId._id) {
				topic.isActive = !topic.isActive;
			} else {
				topic.isActive = false;
			}

			return topic;
		});
		setTopics(topicCopy);

		if (topicId.isActive === true) {
			dispatch(SET_WORD({ topicId: topicId._id }));
		} else {
			dispatch(SET_WORD({ topicId: '' }));
		}
	};
	return (
		<div className="w-ful flex justify-center">
			<div className="flex flex-col gap-10">
				<div className="text-center text-orange-400 font-medium">
					Từ của bạn thuộc chủ để nào vậy nhỉ
				</div>
				<div className="grid grid-cols-3  gap-3">
					{topics.length > 0 &&
						topics?.map((topic, idx) => {
							return (
								<div
									key={idx}
									className={`px-2 pt-1 text-center pt-1 text-center border text-sm rounded shadow ${
										topic.isActive === true ? 'bg-green-200' : ''
									}`}
									onClick={() => chooseTopic(topic)}
								>
									{topic.name}
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}

export default FormStep3;

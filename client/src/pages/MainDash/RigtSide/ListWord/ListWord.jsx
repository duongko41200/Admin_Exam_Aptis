import React from 'react';
import './ListWord.css';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

//Xử lý lại câu từ không nên tách đôi thành 2 phần html như kia
const ListWord = () => {
	const listData = useSelector((state) => state.wordStore.listData);

	return (
		<div className="wrapper-list flex flex-col gap-5 p-2">
			{listData?.length > 0 &&
				listData?.map((data, idx) => {
					if (data.typeText == 'word') {
						return (
							<div
								key={data._id}
								className="detail-list flex flex-col gap-2 "
							>
								<div className="detail-list__top flex justify-between">
									<div className="flex gap-2">
										<div>
											<div className="type-word px-2 w-fit rounded-lg">
												Từ
											</div>
										</div>

										<div className="font-bold ">{data.text}</div>
									</div>

									<div className="text-right min-w-[92px]">
										{dayjs(data.createdAt).format('DD-MM-YYYY')}
									</div>
								</div>
								<div className="detail-list__bottom translate">
									<div>{data.defind}</div>
								</div>
							</div>
						);
					} else {
						return (
							<div
								key={data._id}
								className="detail-list flex flex-col gap-2  "
							>
								<div className="detail-list__top flex justify-between ">
									<div className="flex gap-2 ">
										<div>
											<div className="type-sentence px-2 w-fit rounded-lg">
												Câu
											</div>
										</div>
										<div className="font-bold">
											{data.attributes.structure}
										</div>
									</div>

									<div className="text-right min-w-[92px]">
										{dayjs(data.createdAt).format('DD-MM-YYYY')}
									</div>
								</div>
								<div className="detail-list__bottom">
									<div>{data.text}</div>
									<div className="translate">{data.defind}</div>
								</div>
							</div>
						);
					}
				})}
		</div>
	);
};

export default ListWord;

import dayjs from 'dayjs';
import React from 'react';

function CumtomText({ list, handleShowModalDetail }) {
	return (
		<>
			<div
				className="detail-list flex flex-col gap-2 p-2 rounded-lg border shadow-md"
				//   onClick={handleShowModalDetail(list._id)}
			>
				<div className="detail-list__top flex justify-between">
					<div className="flex gap-2">
						<div className='bg-red flex items-center'>
							<div
								className={`${
									list.typeText === 'word'
										? 'type-word'
										: 'type-sentence'
								} px-2 w-fit rounded-lg`}
							>
								{list.typeText === 'word' ? 'Từ' : 'Câu'}
							</div>
						</div>

						{list.typeText === 'word' ? (
							<div className="font-bold">{list.text}</div>
						) : (
							<div className="font-bold">
								{list.attributes.structure}
							</div>
						)}
					</div>

					<div className="text-right min-w-[92px]">
						{dayjs(list.createdAt).format('DD-MM-YYYY')}
					</div>
				</div>
				<div className="detail-list__bottom flex justify-between">
					<div className="w-[85%]">
						{list.typeText === 'sentence' && <div>{list.text}</div>}
						<div className="translate">{list.defind}</div>
					</div>

					<div className="bg-[#EDC349] text-white p-1 h-fit text-xs align-center rounded-lg">
						Cấp {list.repeat}
					</div>
				</div>
			</div>
		</>
	);
}

export default CumtomText;

import React, { useEffect, useState } from 'react';
import TextService from '../../../services/API/tex.service';
import { RES_DATA } from '../../../Constant/global';
import dayjs from 'dayjs';
import SpinnerLoading from '../../../components/ui/SpinnerLoading/SpinnerLoading';
import CustomText from '../../../components/CustomText/CustomText';

function PenddingCheck() {
	const [listPending, setListPending] = useState([]);
	const [isShow, setIsShow] = useState(false);

	const handleData = async () => {
		const today = dayjs().format('YYYY/MM/DD');
		const localStoragePeding = JSON.parse(localStorage.getItem('listPending'));
		const localStorageDayPeding = localStorage.getItem('dayPending');
		const localStorageChecking = JSON.parse(localStorage.getItem('listChecking')) || [];
		
		if (localStoragePeding?.length > 0 && localStoragePeding[RES_DATA]?.dayReview === today) {
			setListPending(localStoragePeding);
			return;
		}
		
		try {
			if (localStoragePeding?.length === 0 && localStorageDayPeding === today) {
				setListPending([]);
				return;
			}
		
			setIsShow(true);
			const data = await TextService.getListPendding();
			const response = data[RES_DATA].metadata.contents;
		
			if (localStorageDayPeding !== today && response?.length > 0) {
				const dataRequest = {
					day: today,
					metaData: response,
					isShow:false
				};
		
				localStorage.setItem('listChecking', JSON.stringify([dataRequest, ...localStorageChecking]));
			}
		
			localStorage.setItem('dayPending', today);
			setListPending(response);
			setIsShow(false);
		
			localStorage.setItem('listPending', JSON.stringify(response));
		} catch (error) {
			console.log({ error });
			setIsShow(false);
		}
	};

	useEffect(() => {
		handleData();
	}, []);
	return (
		<>
			<div className="filter-check flex justify-between pt-4 pb-2">
				<div className="filter-level">
					<div className="filter mb-2">
						<div className="flex justify-between">
							<div>
								<div className=" font-bold">
									Danh sách cần nâng cấp trong hôm nay
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<SpinnerLoading show={isShow}>
				{isShow ? (
					<div className="w-full h-[300px]"></div>
				) : (
					<div className="wrapper-lists flex flex-col gap-3 pt-6">
						{listPending.length > 0 ? (
							listPending.map((list, idx) => {
								return (
									<div key={idx}>
										<CustomText list={list} />
									</div>
								);
							})
						) : (
							<>
								<div className="w-full h-[300px]">
									Hôm nay, bạn sẽ không phải ôn tập ( nhưng bạn cũng có
									thể tự ôn lại các danh sách từ cũ)
								</div>
							</>
						)}
					</div>
				)}
			</SpinnerLoading>
		</>
	);
}

export default PenddingCheck;

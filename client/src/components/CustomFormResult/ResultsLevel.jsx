import React, { useState } from 'react';
import {
	Typography,
	Button,
	Card,
	CardContent,
	Box,
} from '@mui/material';
import './style.css'; // Kiểm tra xem style.css có sử dụng được hay không
import {
	handleScore,
	reviewResult,
	statusCore,
} from '../../Constant/DetailChecking';
import { COMPONENTS_RESULT_RESEARCH } from '../../Constant/DetailChecking/maneger-component';
import { useStyles } from '../../style/general';
import TextService from '../../services/API/tex.service';
import dayjs from 'dayjs';
import SpinnerLoading from '../ui/SpinnerLoading/SpinnerLoading';
import { filterByDayBeforeToday } from '../../utils/filterByDay';

function ResultsLevel1({
	result,
	question,
	text,
	resGeminiResearch,
	level,
	idText,
	closeModalBottom,
	valueReview,
	setListChecking,
}) {
	const classes = useStyles();
	const [isShowCard, setIsShowCard] = useState(false);
	const [spinerSubmit, setSpinerSubmit] = useState(false);

	const ComponentResultResearch = COMPONENTS_RESULT_RESEARCH[level];

	const handleToggleCard = () => {
		setIsShowCard(!isShowCard);
	};

	const renderScore = () => {
		if (level === 1 || level === 2) {
			return `${result}/${question?.length}`;
		} else if (level === 3 || level === 4) {
			if (
				resGeminiResearch &&
				resGeminiResearch.length === question.length
			) {
				const averageScore =
					(parseInt(resGeminiResearch[0]?.score) +
						parseInt(resGeminiResearch[1]?.score)) /
					2;
				return `${averageScore} point`;
			}
		}
		return null;
	};

	const upgradeLevel = async () => {
		console.log({ valueReview });
		try {
			setSpinerSubmit(true);
			const param = {
				textId: idText,
				repeat: parseInt(level) + 1,
				dayReview: dayjs(new Date())
					.add(parseInt(level) + 1, 'day')
					.format('YYYY/MM/DD'),
			};
			const resUpgrade = await TextService.updateLevelText(param);

			let localStorageChecking =
				JSON.parse(localStorage.getItem('listChecking')) || [];

			// filter list text on localStorage
			localStorageChecking = localStorageChecking.map((value) => {
				if (
					value.day == dayjs(valueReview.dayReview).format('YYYY/MM/DD')
				) {
					value.metaData = value.metaData.filter(
						(value, idx) => value._id != valueReview._id
					);
				}

				return value;
			});
			localStorageChecking = localStorageChecking.filter(
				(value) => value.metaData.length > 0
			);

			//Cập nhâp textdata
			let textData = JSON.parse(localStorage.getItem('textData')) ?? [];
			if (textData.length > 0) {
				textData = textData.map((value) => {
					if (value._id == valueReview._id) {
						(value.dayReview = dayjs(new Date())
							.add(parseInt(level), 'day')
							.format('YYYY/MM/DD')),
							(value.repeat = valueReview.repeat + 1);
					}
					return value;
				});
			}
			localStorage.setItem('textData', JSON.stringify(textData));

			localStorage.setItem(
				'listChecking',
				JSON.stringify(localStorageChecking)
			);

			const listChekingFilterDay = filterByDayBeforeToday(
				localStorageChecking
			);

			setListChecking(listChekingFilterDay);

			closeModalBottom();
			setSpinerSubmit(false);
		} catch (error) {
			console.log({ error });
			setSpinerSubmit(false);
		}
	};

	return (
		<Box className="card">
			<SpinnerLoading show={spinerSubmit}>
				<Box
					className={`card__inner ${isShowCard ? 'is-flipped' : ''}`}
				>
					{!isShowCard ? (
						<Box
							className={`card__face card__face--front ${classes.container}`}
						>
							<Box>
								<Typography variant="h2" className={classes.title}>
									Chúc mừng!
								</Typography>
							</Box>
							<Box className={classes.center}>
								<Card className={classes.card}>
									<CardContent>
										<Typography
											variant="h5"
											className={classes.subtitle}
										>
											Score
										</Typography>
										<Typography variant="h5" className={classes.score}>
											{statusCore(
												handleScore(result, resGeminiResearch, level)
											)}
										</Typography>
										<Typography
											variant="h5"
											className={classes.subtitle}
										>
											{renderScore()}
										</Typography>
									</CardContent>
								</Card>
							</Box>
							<Box className={classes.buttons}>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									onClick={handleToggleCard}
								>
									Tìm hiểu chi tiết
								</Button>
								<Button
									variant="contained"
									color="secondary"
									className={classes.button}
									onClick={upgradeLevel}
								>
									Nâng cấp Level
								</Button>
							</Box>
						</Box>
					) : (
						<Box className="card__face card__face--back">
							<Box className="card__content">
								<Box className="card__header">
									<h3>Panda</h3>
									<h4>
										Đối với "<strong>{text}</strong>": Mình thấy{' '}
										{reviewResult(
											Math.round((result / question?.length) * 100),
											level
										)}
									</h4>
									<Box className={classes.buttonsBox}>
										<Button
											variant="contained"
											color="primary"
											size="small"
											className={classes.buttonss}
											onClick={handleToggleCard}
										>
											Quay lại
										</Button>
										<Button
											variant="contained"
											color="secondary"
											size="small"
											className={classes.buttonss}
										>
											Nâng cấp Level
										</Button>
									</Box>
								</Box>
								<Box className="card__body">
									<h3>Tìm hiểu nâng cao:</h3>
									{resGeminiResearch &&
										resGeminiResearch.map((value, idx) => (
											<Box key={idx}>
												<ComponentResultResearch result={value} />
											</Box>
										))}
								</Box>
							</Box>
						</Box>
					)}
				</Box>
			</SpinnerLoading>
		</Box>
	);
}

export default ResultsLevel1;

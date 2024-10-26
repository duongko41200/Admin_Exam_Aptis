import React from 'react';
import { Box } from '@mui/material';
import { useStylesResearch3 } from '../../../style/general';

function ResultResearch3({ result }) {
	const classes = useStylesResearch3();

	console.log('keets qua cua level 3:', result);

	return (
		<>
			<Box className={classes.wraperBox}>
				<Box className={classes.subtitleScenarios}>
					<i>Nhận xét:</i> {result.comment}
				</Box>
			</Box>
			<Box className={classes.contex}>
				Bạn có thể tham kết quả này: {result.reference}
			</Box>
		</>
	);
}

export default ResultResearch3;

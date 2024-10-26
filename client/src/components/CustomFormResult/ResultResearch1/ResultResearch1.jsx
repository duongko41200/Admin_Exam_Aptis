import React from 'react';
import { Box } from '@mui/material';
import { useStyles } from '../../../style/general';

function ResultResearch1({ result }) {
	const classes = useStyles();

	return (
		<>
			<Box className={classes.subtitleScenarios}>
				{result.scenarios}
			</Box>
			<Box className={classes.contex}>{result.example}</Box>
		</>
	);
}

export default ResultResearch1;

import { makeStyles } from '@mui/styles';

export const styles = {
	container: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		background:
			'linear-gradient(to bottom right, rgb(254, 254, 139), #fec948b0)',
		border: '1px solid hsl(215, 15%, 89%)',
		borderRadius: '30px',
		boxShadow: 'rgba(223, 226, 231, 0.6) 0px 4px 8px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingBottom: '16px',
		gap: 1,
	},
	questionBox: {
		color: 'hsl(215, 15%, 12%)',
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
	},
	innerQuestionBox: {
		width: '100%',
		padding: '10px 8px',
		minHeight: '200px',
		background:
			'linear-gradient(to bottom right, rgb(254, 254, 139), #fec948b0)',
		border: '1px solid hsl(215, 15%, 89%)',
		borderRadius: '15px',
		boxShadow: 'rgba(223, 226, 231, 0.6) 0px 4px 8px',
		display: 'flex',
		gap: '6px',
	},

	questionTextBox: {
		width: '100%',
		padding: '10px 20px',
		minHeight: '100px',
		background: 'linear-gradient(to top, #fff, #fff)',
		border: '1px solid hsl(215, 15%, 89%)',
		borderRadius: '20px',
		boxShadow: 'rgba(223, 226, 231, 0.6) 0px 4px 8px',
		display: 'flex',
		flexDirection: 'column',
		gap: 2,
	},
	questionHeader: {
		fontSize: '25px',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	questionText: {
		fontSize: '16px',
	},
	optionsContainer: {
		padding: '0 5px',
		maxHeight: 'calc(100vh - 180px - 235px)',
		overflow: 'auto',
	},
	optionBox: (isChecked) => ({
		width: '100%',
		minHeight: '50px',
		background: isChecked ? '#1976d291' : '#fff',
		color: isChecked ? '#fff' : 'black',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '5px',
		boxShadow: 'rgba(223, 226, 231, 0.6) 0px 4px 8px',
		border: `solid ${isChecked ? '1px #1976d291' : '1px #00000042'}`,
		borderRadius: '10px',
		marginTop: '8px',
		fontWeight: '700',
		cursor: 'pointer',
	}),
	buttonContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '0 16px',
	},
	backButton: {
		width: '50px',
	},
	submitButton: {
		width: 'fit-content',
		padding: '6px 10px',
	},
	nextButton: {
		width: '50px',
	},
};

export const useStyles = makeStyles({
	container: {
		// margin: '50px auto',
		// #ffce0087, #fec948b0
		padding: 20,
		background: 'linear-gradient(to bottom right, #ffbb00, #fec948b0)',

		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		height: '100%',
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: '100%', // Khung tròn
		boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
		padding: 10,
		textAlign: 'center',
		width: 'fit-content',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		textAlign: 'center',
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 17,
		fontWeight: '600',
		color: 'GrayText',
	},

	subtitleScenarios: {
		fontSize: 18,
		fontWeight: '700',
		color: 'black',
	},
	contex: {
		fontSize: 16,
		fontWeight: '500',
		color: 'GrayText',
	},
	score: {
		fontSize: 30,
		fontWeight: 700,
		color: 'forestgreen',
	},
	buttons: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		marginTop: 10,
		width: '100%',
	},
	buttonss: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		marginTop: 10,
	},
	buttonsBox: {
		display: 'flex',
		justifyContent: 'start',
		fontSize: '16px',
		marginTop: 10,
		gap: 3,
	},
	button: {
		margin: 2,
		width: '100%',
		padding: '10px 0',
	},

	account: {
		marginTop: 20,
		fontSize: 12,
		color: '#999',
	},
	center: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export const useStylesResearch3 = makeStyles({
	subComment: {
		fontSize: 16,
		fontWeight: '700',
		color: 'black',
	},
	contex: {
		fontSize: 16,
		fontWeight: '500',
		color: 'GrayText',
	},

	wraperBox: {
		background: '#25b09b2b',
		padding: '8px 12px',
		borderRadius: '8px',
		border: '1px solid #dae2ed',
		boxShadow: ' 0px 3px 4px #fff',
	},
});

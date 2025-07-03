import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initDb from './dbs/init.mongodb.js';
import { checkOverload } from './helpers/check.connect.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.post('https://api.telegram.org/bot6893164702:AAEPdDlqfEy20Np_goXO7R-9cqAgfelPys0/setWebHook?url=https://bot-app-english.vercel.app'
// );

// init db
// initDb();
checkOverload();

// init router
app.use('/', routes);

//handling errors
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	const statusCode = err.status || 500;

	console.log('looix', err);
	return res.status(statusCode).json({
		status: 'err',
		code: statusCode,
		stack: err.stack,
		message: err.message || 'Internal Server Error',
	});
});

export default app;

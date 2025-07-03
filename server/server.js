import app from './src/app.js';
const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, () => {
	console.log(`WSV eCommerce started ${PORT} `);
	

});

process.on('SIGINT', () => {
	server.close((err) => {
		console.log('Exit Server Express');

	});
});

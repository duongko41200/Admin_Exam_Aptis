import app from './src/app.js';
const PORT = process.env.PORT || 3334;

const server = app.listen(PORT,'0.0.0.0', () => {
	console.log(`WSV eCommerce started ${PORT} `);
	

});

process.on('SIGINT', () => {
	server.close((err) => {
		console.log('Exit Server Express');

	});
});

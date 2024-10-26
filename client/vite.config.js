import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	
	],
	envPrefix:'APP_',
	server: {
		port: 8001,
	},
});

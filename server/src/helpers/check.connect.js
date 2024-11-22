'use strict';

import mongoose from 'mongoose';
const _SECONDS = 5000;
const countConnect = () => {
	const numConnections = mongoose.connections.length;
	console.log('Mumber of connections', numConnections);
};

import process from 'process';
import os from 'os';

// check over load
const checkOverload = () => {
	setInterval(() => {
		const numConnections = mongoose.connections.length;
		const numCores = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss;

		const maxConnections = numCores * 5;

		// console.log(`Memory usage: ${memoryUsage / 1024 / 1024}MB`);

		if (numConnections > maxConnections) {
			console.log('Connection overLoad detected');
		}
	}, _SECONDS); //minitor every 5 seconds
};

export {
	countConnect,
	checkOverload,
};

'use strict';

import { findbyId } from '../services/apikey.service.js';

const HEADER = {
	API_KEY: 'x-api-key',
	AUTHORIZATION: 'authorization',
};

export const apiKey = async (req, res, next) => {
	try {

		console.log("req.headers", req.headers);
		const key = req.headers[HEADER.API_KEY]?.toString();
		console.log({ key });
		if (!key) {
			return res.status(403).json({
				message: 'Fobidden Error apikey',
			});
		}

		//check objkey in db
		const objKey = await findbyId(key);
		
		console.log({objKey})
		if (!objKey) {
			return res.status(403).json({
				message: 'Fobidden Error',
			});
		}

		req.objKey = objKey;
		return next();
	} catch (error) {
		console.log({ error });
	}
};

export const permission = (permission) => {
	return (req, res, next) => {
		if (!req.objKey.permissions) {
			return res.status(403).json({
				message: 'permisstion denied',
			});
		}
		console.log('permistion:', req.objKey.permissions);

		const valiPermissions = req.objKey.permissions.includes(permission);
		if (!valiPermissions) {
			return res.status(403).json({
				message: 'permisstion denied',
			});
		}
		return next();
	};
};

export const asyncHandle = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next)
	};
};

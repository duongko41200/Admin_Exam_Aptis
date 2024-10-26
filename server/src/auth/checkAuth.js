'use strict';

const { findbyId } = require('../services/apikey.service');

const HEADER = {
	API_KEY: 'x-api-key',
	AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
	try {
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

const permission = (permission) => {
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

const asyncHandle = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next)
	};
};
module.exports = {
	apiKey,
	permission,
	asyncHandle
};

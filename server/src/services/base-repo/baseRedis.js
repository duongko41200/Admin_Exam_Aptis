import redis from '../../lib/redis.config.js';

// Get one field from a hash
const redisGetField = async ({ hash, field }) => {
	const raw = await redis.hGet(hash, field);
	try {
		return raw !== null ? JSON.parse(raw) : null;
	} catch {
		return raw;
	}
};

// Get all fields from a hash
const redisGetAll = async ({ hash }) => {
	const rawObject = await redis.hGetAll(hash);
	const parsedObject = {};

	for (const key in rawObject) {
		try {
			parsedObject[key] = JSON.parse(rawObject[key]);
		} catch {
			parsedObject[key] = rawObject[key];
		}
	}

	return parsedObject;
};

// Set field in hash (create or overwrite)
const redisSetField = async ({ hash, field, value }) => {
	const stringValue =
		typeof value === 'string' ? value : JSON.stringify(value);
	await redis.hSet(hash, field, stringValue);
	return true;
};

// Delete field from hash
const redisDeleteField = async ({ hash, field }) => {
	const result = await redis.hDel(hash, field);
	return result > 0;
};

// Check if field exists in hash
const redisFieldExists = async ({ hash, field }) => {
	return await redis.hExists(hash, field);
};

export {
	redisGetField,
	redisGetAll,
	redisSetField,
	redisDeleteField,
	redisFieldExists,
};

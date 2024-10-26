'use strict';

const StatusCode = {
	OK: 200,
	CREATED: 201,
};

const ReasonStatusCode = {
	OK: 'Success',
	CREATED: 'Created',
};

class SuccessResponse {
	constructor({
		metadata = {},
		message,
		statusCode = StatusCode.OK,
		reasonStatus = ReasonStatusCode.OK,
	
	}) {
		this.status = statusCode;
		this.message = !message ? reasonStatus : message;
		this.metadata = metadata;
	}
	send(res) {
		return res.status(this.status).json(this);
	}
}

class OK extends SuccessResponse {
	constructor(message, metadata) {
		super(metadata,message);
	}
}

class CREATED extends SuccessResponse {
	constructor({
		metadata,
		message,
		status = StatusCode.CREATED,
		reasonStatus = ReasonStatusCode.CREATED,
		
	}) {
		super({ metadata, message, status, reasonStatus });
	}
}

module.exports = {
	OK,
	CREATED,
	SuccessResponse
};

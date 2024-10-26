'use strict';

const StatusCode = {
	FOBIDEN: 403,
	CONFLIC: 409,
};

const ReasonStatusCode = {
	FOBIDEN: 'Bad request Error',
	CONFLIC: 'Conflic Error',
};
const {
	
	ReasonPhrases,
	StatusCodes,
} = require('../utils/httpStatusCode');

class ErrorResponse extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

class ConflcRequestError extends ErrorResponse {
	constructor(
		message = ReasonStatusCode.CONFLIC,
		statusCode = StatusCode.CONFLIC
	) {
		super(message, statusCode);
	}
}
class BadRequestError extends ErrorResponse {
	constructor(
		message = ReasonStatusCode.FOBIDEN,
		statusCode = StatusCode.FOBIDEN
	) {
		super(message, statusCode);
	}
}
class AuthFailureError extends ErrorResponse{
	constructor(message = ReasonPhrases.UNAUTHORIZED, StatusCode = StatusCodes.UNAUTHORIZED) {
		super(message,StatusCode)
	}
}
class NotFoundError extends ErrorResponse{
	constructor(message = ReasonPhrases.NOT_FOUND, StatusCode = StatusCodes.NOT_FOUND) {
		super(message,StatusCode)
	}
}
class ForbiddenError  extends ErrorResponse{
	constructor(message = ReasonPhrases.FORBIDDEN, StatusCode = StatusCodes.FORBIDDEN) {
		super(message,StatusCode)
	}
}


module.exports = { ConflcRequestError, BadRequestError,AuthFailureError,NotFoundError,ForbiddenError };

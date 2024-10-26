'use strict';

const _ = require('lodash');

const getIntoData = ({ fileds = [], object = {} }) => {
	return _.pick(object, fileds);
};

module.exports = { getIntoData };

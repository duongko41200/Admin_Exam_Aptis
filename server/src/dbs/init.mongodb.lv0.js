'use strict';

const mongoose = require('mongoose');

const connectString = 'mongodb://127.0.0.1:27017/dev'
mongoose.connect(connectString).then(_ => console.log("connect Mongodb Sucessfully")).catch(err => console.log("Error Connect", err))

//dev
if (1 === 1) {
	mongoose.set('debug', true)
	mongoose.set('debug', {color: true})
}

module.exports = mongoose
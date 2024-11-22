'use strict';

import mongoose from 'mongoose';
import db from '../configs/config.mongodb.js';
import { countConnect } from '../helpers/check.connect.js';
import dotenv from 'dotenv';
dotenv.config();

const { host, port, name } = db.db;


let connectString = '';

// Kiểm tra nếu db cấu hình không có đủ giá trị
if (!host || !port || !name) {
    console.error('MongoDB configuration is missing required parameters: host, port, or name');
    process.exit(1);  // Dừng ứng dụng nếu thiếu cấu hình
}

if (process.env.NODE_ENV === 'dev') {
    connectString = `mongodb://${host}:${port}/${name}`;
} else {
	connectString = process.env.MONGO_URL_PRO;
	console.log({tesst:connectString})
}



if (!connectString) {
    console.error('MongoDB connection string is not defined.');
    process.exit(1);  // Dừng ứng dụng nếu không có kết nối MongoDB
}

console.log('MongoDB connect string:', connectString);

const instanceMongodb = new class Database {
    constructor() {
        this.connect();
    }

    connect() {
        if (process.env.NODE_ENV === 'dev') {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose
            .connect(connectString, { maxPoolSize: 50 })
            .then(() => {
                console.log('MongoDB connected successfully', countConnect());
            })
            .catch((err) => {
                console.error('Error connecting to MongoDB:', err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}();

export default instanceMongodb;

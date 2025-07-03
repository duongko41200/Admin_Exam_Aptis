// cloudinary-config.js

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Thiết lập thông tin Cloudinary
cloudinary.config({
  cloud_name: "dys0lk3ly",
  api_key: "487986324139414",
  api_secret: "cvMGKbZ45JucH0fZs7SBo44DDzI",
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'images_speaking_aptis'
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const uploadCloud = multer({ storage });

export default  uploadCloud ;

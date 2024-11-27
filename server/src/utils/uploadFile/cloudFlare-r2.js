import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cấu hình AWS SDK để kết nối với Cloudflare R2
// const s3 = new AWS.S3({
//   accessKeyId: "eac5aa24be21c586bd0c0ad3ba952a14", // Thay bằng Access Key của bạn
//   secretAccessKey:
//     "e4cac2d8a6ec111c936ea39153e9130d9a65b1f60133a14512eb87aab26a6318", // Thay bằng Secret Key của bạn
//   endpoint: "https://5279a7f74a4a2579a63b720ab43cc811.r2.cloudflarestorage.com", // Thay bằng endpoint R2 của bạn
//   region: "auto", // Region thường là 'auto'
//   signatureVersion: "v4",
//   s3ForcePathStyle: true, // Đảm bảo sử dụng path style URL cho R2
// });


const S3 = new S3Client({
  endpoint: "https://5279a7f74a4a2579a63b720ab43cc811.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "eac5aa24be21c586bd0c0ad3ba952a14",
    secretAccessKey:
      "e4cac2d8a6ec111c936ea39153e9130d9a65b1f60133a14512eb87aab26a6318",
  },
  region: "auto",
});

const generateSignedUrl = async (filePath) => {

  console.log('filePath:', filePath);
  try {
    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: filePath.originalname, // Tên bucket
        Key: filePath.buffer, // Tên hoặc đường dẫn đối tượng
      }),
      {
        expiresIn: 60 * 60 * 24 * 7, // URL có hiệu lực trong 7 ngày
      }
    );

        console.log("url:", url);
    return url; // Trả về URL đã ký


  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

// Tên bucket của bạn trên Cloudflare R2
// const bucketName = "images-speaking";

// // Hàm tải ảnh lên R2
//  function uploadImage(filePath) {

//   console.log('filePath:', filePath);
//   const fileName = path.basename(filePath.originalname); // Lấy tên file từ đường dẫn

//   const params = {
//     Bucket: bucketName,
//     Key: fileName, // Tên file trong R2 bucket
//     Body: filePath.buffer, // Nội dung file
//     ContentType: filePath.mimetype, // Loại nội dung của ảnh (thay đổi nếu bạn upload loại ảnh khác)
//     ACL: "public-read", // Quyền truy cập của file (có thể là 'private' hoặc 'public-read')
//   };

//   // Upload ảnh lên Cloudflare R2
//   s3.upload(params, function (err, data) {
//     if (err) {
//       console.log("Error upload Image:", err);
//     } else {
//       console.log("upload image succesfully:", data);
//       return data;
//     }
//   });
// }

// Ví dụ gọi hàm với tệp ảnh
export default generateSignedUrl;
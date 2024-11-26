import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

// Cấu hình AWS SDK để kết nối với Cloudflare R2
const s3 = new AWS.S3({
  accessKeyId: "eac5aa24be21c586bd0c0ad3ba952a14", // Thay bằng Access Key của bạn
  secretAccessKey:
    "e4cac2d8a6ec111c936ea39153e9130d9a65b1f60133a14512eb87aab26a6318", // Thay bằng Secret Key của bạn
  endpoint: "https://5279a7f74a4a2579a63b720ab43cc811.r2.cloudflarestorage.com", // Thay bằng endpoint R2 của bạn
  region: "auto", // Region thường là 'auto'
  signatureVersion: "v4",
  s3ForcePathStyle: true, // Đảm bảo sử dụng path style URL cho R2
});

// Tên bucket của bạn trên Cloudflare R2
const bucketName = "images-speaking";

// Hàm tải ảnh lên R2
function uploadImage(filePath) {
  const fileName = path.basename(filePath); // Lấy tên file từ đường dẫn
  const fileStream = fs.createReadStream(filePath); // Đọc tệp hình ảnh

  const params = {
    Bucket: bucketName,
    Key: fileName, // Tên file trong R2 bucket
    Body: fileStream, // Nội dung file
    ContentType: "image/jpeg", // Loại nội dung của ảnh (thay đổi nếu bạn upload loại ảnh khác)
    ACL: "public-read", // Quyền truy cập của file (có thể là 'private' hoặc 'public-read')
  };

  // Upload ảnh lên Cloudflare R2
  s3.upload(params, function (err, data) {
    if (err) {
      console.log("Error upload Image:", err);
    } else {
      console.log("upload image succesfully:", data);
    }
  });
}

// Ví dụ gọi hàm với tệp ảnh
uploadImage("./path_to_your_image.jpg"); // Thay bằng đường dẫn đến ảnh của bạn

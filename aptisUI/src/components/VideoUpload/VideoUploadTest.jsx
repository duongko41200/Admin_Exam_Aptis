import React from "react";
import VideoUpload from "./VideoUpload";

// Test component VideoUpload với chức năng xóa file R2
function VideoUploadTest() {
  const handleFileSelected = (file, fileInfo) => {
    console.log("File selected:", { file, fileInfo });
  };

  const handleUrlChange = (url) => {
    console.log("URL changed:", url);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🎬 Video Upload với R2 Delete</h1>
      <p>Test component upload video và xóa file trên R2 storage</p>

      <VideoUpload
        onFileSelected={handleFileSelected}
        onUrlChange={handleUrlChange}
        maxSizeGB={2}
        disabled={false}
      />

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>✨ Tính năng mới:</h3>
        <ul>
          <li>📤 Upload file trực tiếp lên Cloudflare R2</li>
          <li>🗑️ Xóa file khỏi R2 khi clear component</li>
          <li>⚠️ Dialog xác nhận trước khi xóa</li>
          <li>🔗 Lưu R2 key để quản lý file</li>
          <li>📊 Progress tracking upload</li>
        </ul>
      </div>
    </div>
  );
}

export default VideoUploadTest;

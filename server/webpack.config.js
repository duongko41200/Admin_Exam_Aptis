const path = require("path");
const webpackNodeExternals = require("webpack-node-externals"); // Đảm bảo đã cài module này nếu chưa

module.exports = {
  entry: "./server.js", // Đảm bảo đường dẫn đúng
  output: {
    filename: "bundle.js", // Tên tệp đầu ra
    path: path.resolve(__dirname, "dist"), // Đường dẫn thư mục output
  },
  resolve: {
    // Alias để thay thế các mô-đun Node.js với các polyfill
    alias: {
      crypto: require.resolve("crypto-browserify"), // Polyfill cho crypto
      path: require.resolve("path-browserify"), // Polyfill cho path
      os: require.resolve("os-browserify/browser"), // Polyfill cho os
      stream: require.resolve("stream-browserify"), // Polyfill cho stream
      buffer: require.resolve("buffer/"), // Polyfill cho buffer
      util: require.resolve("util/"), // Polyfill cho util
      url: require.resolve("url/"),
    },
    fallback: {
      // Các fallback polyfills cho những mô-đun khác nếu cần thiết
      fs: false, // Loại bỏ fs nếu không cần thiết
      net: false, // Loại bỏ net nếu không cần thiết
      tls: false, // Loại bỏ tls nếu không cần thiết
    },
    extensions: [".js", ".json"], // Hỗ trợ các phần mở rộng tệp
  },
  externals: [
    webpackNodeExternals(),
    "mock-aws-s3", // Đánh dấu mock-aws-s3 là external
    "aws-sdk", // Đánh dấu aws-sdk là external
    "nock",

    "fs",
    "path",
    "crypto",
  ], // Loại trừ các mô-đun Node.js khỏi bundle
  plugins: [
    // Các plugin bổ sung (nếu có)
  ],
  target: "node", // Chỉ định rằng bạn đang tạo một ứng dụng Node.js
  mode: "production", // Chế độ production
};

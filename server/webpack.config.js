// webpack.config.js
import path from "path";
import { fileURLToPath } from "url";
import nodeExternals from "webpack-node-externals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./server.js", // Hoặc './src/server.js' nếu bạn dùng thư mục src
  target: "node",
  externals: [nodeExternals()], // Để bỏ qua node_modules khi bundle
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.bundle.js",
  },
  mode: "production",
};

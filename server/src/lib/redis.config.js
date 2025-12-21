// lib/redis.ts
import { createClient } from "redis";

const REDIS_URL =
  "redis://default:VErRkDViH9iN1jSkC0QC3Ui5PDPR5rFp@redis-14754.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com:14754";

const client = createClient({
  url: process.env.REDIS_URL || REDIS_URL, // Example: redis://default:<password>@<host>:<port>
});

client.on("error", (err) => {
 return
});

if (!client.isOpen) {
  client.connect(); // Chỉ kết nối nếu chưa mở
}

export default client;

import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import initDb from "./dbs/init.mongodb.js";
import { checkOverload } from "./helpers/check.connect.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3833",
      "https://app.aptisacademy.com.vn",
      "http://localhost:4000",
      "https://cmss.aptisacademy.com.vn",
      "http://localhost:3000",
      "https://aptisacademy.com.vn",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Increase payload limits for video uploads
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);

// app.post('https://api.telegram.org/bot6893164702:AAEPdDlqfEy20Np_goXO7R-9cqAgfelPys0/setWebHook?url=https://bot-app-english.vercel.app'
// );

// init db
// initDb();
checkOverload();

// init router
app.use("/", routes);

//handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  console.log("looix", err);
  return res.status(statusCode).json({
    status: "err",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});

export default app;

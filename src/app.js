const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config({
  path: path.resolve(__dirname, `./config/.${process.env.NODE_ENV}.env`),
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());

const userAuthRouter = require("./routes/userAuth");
const userProfileRouter = require("./routes/userProfile");
const { errorHandler } = require("./middlewares/error");
const logger = require("./supports/logger");

app.use("/profile", userProfileRouter);
app.use("/user", userAuthRouter);

app.use(errorHandler);

connectDB()
  .then(() => {
    logger.info("DB connection is established");
    app.listen(`${process.env.PORT}`, () => {
      logger.info(`server is running on the port no: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    logger.error("DB connection failed");
  });

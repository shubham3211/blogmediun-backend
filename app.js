require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
const port = process.env.PORT;
var app = express();
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const mongoose = require("mongoose");
const userRoutes = require("./api/routes/userRoutes").router;
const blogRoute = require("./api/routes/blogRoutes").router;
const imageUploadRoute = require("./api/routes/imageUploadRoutes").router;
const customLogger = require("./config/logger");
const cors = require('cors');
mongoose.Promise = global.Promise;

let whitelist = [];

app.use(
  cors({
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin) == -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const limit = rateLimit({
  max: 150, // max requests
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: "Too many requests" // message to send
});
app.use(xssClean());
app.use("/user", userRoutes);
app.use("/blog", blogRoute);
app.use("/image-upload", imageUploadRoute);

app.use(function(req, res, next) {
  next(createError(404));
});

process.on("unhandledRejection", err => {
  customLogger.error(err);
});

// error handler
app.use(function(err, req, res, next) {
  let status = err.status ? err.status : 500;
  // customLogger.error(err);
  console.error(err);
  return res.status(status).send({ message: err.message, done: false });
});
app.listen(port, () => console.log(`REST API server Started on ${port}`));

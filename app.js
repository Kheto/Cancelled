require("dotenv").config({path: 'config.env'});

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

if(process.env.API_KEY === undefined || process.env.BASE_ID === undefined){
  throw new Error("config.env appears to be missing or incorrect")
}

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

if(process.env.npm_config_https_proxy && process.env.npm_config_http_proxy){
  var globalAgent = require("global-agent");
  // process.env.GLOBAL_AGENT_HTTP_PROXY = "http://localhost:5555";
  process.env.GLOBAL_AGENT_HTTPS_PROXY = process.env.npm_config_https_proxy;
  process.env.GLOBAL_AGENT_HTTP_PROXY = process.env.npm_config_http_proxy;
  
  globalAgent.bootstrap()
}

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

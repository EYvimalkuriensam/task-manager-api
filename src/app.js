const express = require("express");
require("./db/mongoose");

const userRouter = require("./routes/User");
const taskRouter = require("./routes/Task");

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

module.exports = app;

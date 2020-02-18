const express = require("express");
require("./db/mongoose");

const userRouter = require("./routes/User");
const taskRouter = require("./routes/Task");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
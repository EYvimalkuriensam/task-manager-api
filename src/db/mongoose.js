const mongoose = require("mongoose");

const connectionURL = process.env.MONGODB_URL;

mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

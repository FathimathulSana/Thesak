const mongoose = require("mongoose");

const connection = mongoose
  .connect("mongodb://localhost:27017/thesak", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

module.exports = connection;

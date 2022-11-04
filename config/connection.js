const mongoose = require("mongoose");

const connection = mongoose
  .connect("mongodb+srv://thesak:thesakatgmail.com@cluster0.spxy8zr.mongodb.net/Thesak", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

module.exports = connection;

const multer = require("multer");
const path = require("path");

//set storage engine-multer//

// --------------product images----------------//

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/productImageUploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
module.exports = upload;

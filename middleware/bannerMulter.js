const multer = require("multer");
const path = require("path");

// ---------------Banner images------------------//

const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/bannerImageUploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const uploads = multer({ storage: storages });
module.exports = uploads;

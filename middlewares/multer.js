const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);//Specifies name of the file which will be store in a provided destination.
  },
});

module.exports = { storage } ;

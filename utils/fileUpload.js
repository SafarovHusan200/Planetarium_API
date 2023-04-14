const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// upload
const upload = multer({
  storage,
  limits: { fileSize: 40000000 },
  fileFilter: function (req, file, cb) {
    checkFileTypes(file, cb);
  },
});

// check file types
function checkFileTypes(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: You can only upload image files");
  }
}

module.exports = upload;

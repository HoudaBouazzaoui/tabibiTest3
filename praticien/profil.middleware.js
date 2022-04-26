const multer = require("multer");
const imageFilter = (req, file, cb) => {
  console.log('------------------DEB img MIDD---------------  imageFilter');
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
  console.log('------------------FIN img MIDD---------------  imageFilter');
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('------------------DEB img MIDD---------------  storage.destination');
    //cb(null, __basedir + "/resources/static/assets/uploads/");
    cb(null, "./resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log('------------------DEB img MIDD---------------  storage.filename');
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
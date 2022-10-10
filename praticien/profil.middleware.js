const multer = require("multer");
const pathImg1 = "./resources/static/assets/uploads/";
const pathImg = "./resources/imgProfil/uploads/";
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
    cb(null, pathImg);
  },
  filename: (req, file, cb) => {
    console.log('------------------DEB img MIDD---------------  storage.filename');
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
const multer = require("multer");
const uuid = require("uuid").v4;

const upload = multer({
  storage: multer.diskStorage({
    // 이미지 저장 경로
    destination: "product-data/images",
    // 이미지 저장 이름
    filename: function(req, file, cb) {
      // cb(error, fileName);
      cb(null, uuid() + "-" + file.originalname);
    }
  })
});

module.exports = upload.single("image");
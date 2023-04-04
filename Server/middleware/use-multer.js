const multer = require('multer');

// cấu hình nơi lưu files và tên sẽ lưu
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const finalFilename =
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
    cb(null, finalFilename);
  },
});

// Lọc file bằng Mimetype
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// multer upload file
const upload = multer({ storage: fileStorage, fileFilter });

module.exports = upload;

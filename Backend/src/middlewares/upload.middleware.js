const multer = require('multer');
const path = require('path');
const { httpStatus } = require('../config/constant');
const ApiError = require('../utils/ApiError');
const config = require('../config/app.config');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxSize,
  },
  fileFilter,
});

const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
};

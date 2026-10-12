
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "library-management/authors",
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "image",
    transformation: [{ width: 800, crop: "limit", quality: "auto" }]
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;


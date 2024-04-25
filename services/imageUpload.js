const cloudinary = require("cloudinary").v2;
const {
  CLOUDINARY_USER_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../config");

cloudinary.config({
  cloud_name: CLOUDINARY_USER_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const cloudinaryImageUploadMethod = async (file, id) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      { folder: `complaintImages/${id}` },
      (err, res) => {
        if (err) return res.status(500).send("upload image error");
        resolve({
          res: res.secure_url,
        });
      }
    );
  });
};

module.exports = { cloudinary, cloudinaryImageUploadMethod };

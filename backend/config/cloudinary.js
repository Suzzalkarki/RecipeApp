const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Configure Cloudinary with our credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("ENV CHECK:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

// 2. Set up storage — tells multer WHERE to store files
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'recipenest',      // folder name in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],  // allowed file types
    transformation: [{ width: 800, quality: 'auto' }], // auto-optimize size
  },
});

// 3. Create the multer upload middleware
const upload = multer({ storage });

module.exports = { cloudinary, upload };
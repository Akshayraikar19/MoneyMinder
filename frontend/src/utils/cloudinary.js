import { Cloudinary } from 'cloudinary-core';

// Initialize Cloudinary
const cloudinary = new Cloudinary({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  secure: true
});

export default cloudinary;

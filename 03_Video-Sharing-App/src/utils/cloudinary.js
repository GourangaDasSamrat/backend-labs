import { v2 as cloudinary } from "cloudinary";
import { deleteLocalFile } from "./fileHelper.js";

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// file upload
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      upload_preset: "backend-labs",
    });
    deleteLocalFile(localFilePath);
    return res;
  } catch (err) {
    deleteLocalFile(localFilePath);
    return null;
  }
};

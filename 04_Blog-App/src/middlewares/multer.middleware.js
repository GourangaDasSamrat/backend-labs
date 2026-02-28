import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, _, cb) {
    cb(null, `./public/temp`);
  },
  filename: function (_, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const multerUpload = multer({ storage });

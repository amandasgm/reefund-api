import multer from "multer";  
import path from "node:path";
import crypto from "node:crypto";


// arquivo temporario para onde os arquivos serão enviados antes de serem movidos para a pasta uploads
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");

// arquivo final para onde os arquivos serão movidos depois de serem enviados
const UPLOADS_FOLDER = path.resolve(__dirname, "..", "..", "uploads");

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    }
  })
}

export default { TMP_FOLDER, UPLOADS_FOLDER, MAX_FILE_SIZE, ACCEPTED_FILE_TYPES, MULTER };

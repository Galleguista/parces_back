import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const baseUploadsPath = join(__dirname, '..', 'uploads', 'recursos');
      

      if (!existsSync(baseUploadsPath)) {
        mkdirSync(baseUploadsPath, { recursive: true });
      }

      callback(null, baseUploadsPath);
    },
    filename: (req, file, callback) => {
      const fileExtName = extname(file.originalname);
      const filename = `${uuidv4()}${fileExtName}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type!'), false);
    }
  },
};

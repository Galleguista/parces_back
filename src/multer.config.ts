import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = (allowedMimeTypes: string[]) => ({
  storage: diskStorage({
    destination: (req, file, callback) => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const baseUploadsPath = '/home/ec2-user/uploads';

      const folderPath = join(baseUploadsPath, year.toString(), month, day);

      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }

      callback(null, folderPath);
    },
    filename: (req, file, callback) => {
      const fileExtName = extname(file.originalname);
      const filename = `${uuidv4()}${fileExtName}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type!'), false);
    }
  },
});

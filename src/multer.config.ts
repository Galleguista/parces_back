import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerConfig = () => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const controllerPath = req.route.path.split('/').filter(segment => segment !== '' && segment !== 'api' && segment !== 'v1');
        const controllerFolder = controllerPath.join('/');
        const uploadPath = join('/home/ec2-user/uploads', controllerFolder, year, month, day);

        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      } catch (error) {
        console.error('Error creating directories', error);
        cb(new Error('Error creating directories'), null);
      }
    },
    filename: (req, file, cb) => {
      const fileExt = extname(file.originalname);
      const filename = `${uuidv4()}${fileExt}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg', 
      'image/png', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'application/vnd.ms-excel'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { extname, join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

@Injectable()
export class FilesService {
  private baseUploadPath = '/home/ec2-user/uploads';

  async handleFileUpload(file: Express.Multer.File, req: any): Promise<any> {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const controllerPath = req.route.path.split('/').filter(segment => segment !== '' && segment !== 'api' && segment !== 'v1');
      const controllerFolder = join(...controllerPath);
      const relativePath = `uploads/${controllerFolder}/${year}/${month}/${day}/${file.filename}`;
      const fullUploadPath = join(this.baseUploadPath, controllerFolder, year, month, day);
      if (!existsSync(fullUploadPath)) {
        mkdirSync(fullUploadPath, { recursive: true });
      }
      const urlPath = relativePath.replace('uploads', 'files');
      return { relativePath: urlPath };
    } catch (error) {
      throw new BadRequestException('Error processing the file');
    }
  }

  getFileUrl(imagePath: string): string | null {
    if (!imagePath) return null;

    try {
      return imagePath.replace('uploads', 'files'); 
    } catch (error) {
      return null;
    }
  }

  async getFile(filePath: string): Promise<Buffer> {
    const fullPath = join(this.baseUploadPath, filePath);
    if (!existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }
    return readFileSync(fullPath);
  }
}

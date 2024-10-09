import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { createReadStream, existsSync } from 'fs'; 
import { join } from 'path';
import { Response } from 'express';  
import { multerConfig } from 'src/multer.config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig()))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const relativePath = await this.filesService.handleFileUpload(file, req);
    return { relativePath };
  }

  @Get(':module/:submodule/:subsubmodule/:year/:month/:day/:filename')
  async getFile(
    @Param('module') module: string,
    @Param('submodule') submodule: string,
    @Param('subsubmodule') subsubmodule: string,
    @Param('year') year: string,
    @Param('month') month: string, 
    @Param('day') day: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    
    const filePath = join(
      '/home/orion7/uploads', 
      module, 
      submodule, 
      subsubmodule,
      year, 
      month, 
      day, 
      filename
    );

    console.log(`Buscando archivo en la ruta: ${filePath}`);

    if (!existsSync(filePath)) {
      console.error(`Archivo no encontrado en: ${filePath}`);
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    try {
      
      const imageStream = createReadStream(filePath);
      res.setHeader('Content-Type', 'image/png'); 
      imageStream.pipe(res);

      imageStream.on('error', (err) => {
        console.error(`Error al leer el archivo: ${err.message}`);
        return res.status(500).json({ message: 'Error al leer el archivo' });
      });

    } catch (error) {
      console.error(`Error general: ${error.message}`);
      return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
  }
}

import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { createReadStream, existsSync } from 'fs'; 
import { join, extname } from 'path';
import { Response } from 'express';  
import { multerConfig } from 'src/multer.config';
import { ApiTags } from '@nestjs/swagger';
import * as mime from 'mime-types'; // Usar esta librería para identificar el tipo MIME

@ApiTags('archivos')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig()))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const relativePath = await this.filesService.handleFileUpload(file, req);
    return { relativePath };
  }

  @Get(':module/:submodule/:year/:month/:day/:filename')
  async getFile(
    @Param('module') module: string,
    @Param('submodule') submodule: string,
    @Param('year') year: string,
    @Param('month') month: string, 
    @Param('day') day: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Generar la ruta completa al archivo
    const filePath = join(
      '/home/ec2-user/uploads', 
      module, 
      submodule, 
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
      // Obtener la extensión del archivo
      const fileExtension = extname(filePath);
      // Obtener el tipo MIME basado en la extensión del archivo
      const mimeType = mime.lookup(fileExtension) || 'application/octet-stream';
      
      // Crear un stream de lectura
      const fileStream = createReadStream(filePath);

      // Configurar el encabezado `Content-Type` de acuerdo al tipo de archivo
      res.setHeader('Content-Type', mimeType);

      // Enviar el archivo como respuesta
      fileStream.pipe(res);

      fileStream.on('error', (err) => {
        console.error(`Error al leer el archivo: ${err.message}`);
        return res.status(500).json({ message: 'Error al leer el archivo' });
      });

    } catch (error) {
      console.error(`Error general: ${error.message}`);
      return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
  }
}

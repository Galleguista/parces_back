import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicacion } from './entities/publicacion.entity';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UserService } from 'src/users/users.service';
import { FilesService } from 'src/system/files/files.service';


@Injectable()
export class MuroService {
  constructor(
    @InjectRepository(Publicacion)
    private publicacionRepository: Repository<Publicacion>,
    private usersService: UserService,
    private filesService: FilesService, 
  ) {}

  async createPublicacion(createPublicacionDto: CreatePublicacionDto, usuarioId: string, imagen?: Express.Multer.File): Promise<any> {
    const newPublicacion = this.publicacionRepository.create({ ...createPublicacionDto, usuario_id: usuarioId });

    if (imagen) {
      const imagenPath = await this.filesService.handleFileUpload(imagen, { user: { usuario_id: usuarioId } });
      newPublicacion.imagen_url = imagenPath.relativePath;
    }

    const savedPublicacion = await this.publicacionRepository.save(newPublicacion);

    const usuario = await this.usersService.findOne(usuarioId);
    const usuarioInfo = usuario ? {
      nombre: usuario.nombre || 'Anonymous',
      avatar: usuario.avatar ? this.filesService.getFileUrl(usuario.avatar) : null,
    } : {
      nombre: 'Anonymous',
      avatar: null,
    };

    return {
      ...savedPublicacion,
      usuario: usuarioInfo,
      imagen_url: typeof savedPublicacion.imagen_url === 'string' ? this.filesService.getFileUrl(savedPublicacion.imagen_url) : null, 
    };
  }

  async findAllPublicaciones(): Promise<any[]> {
    const publicaciones = await this.publicacionRepository.find({ order: { fecha_publicacion: 'DESC' } });

    const publicacionesConUsuario = await Promise.all(publicaciones.map(async (publicacion) => {
      const usuario = await this.usersService.findOne(publicacion.usuario_id);
      const usuarioInfo = usuario ? {
        nombre: usuario.nombre || 'Anonymous',
        avatar: usuario.avatar ? this.filesService.getFileUrl(usuario.avatar) : null,
      } : {
        nombre: 'Anonymous',
        avatar: null,
      };

      return {
        ...publicacion,
        imagen_url: typeof publicacion.imagen_url === 'string' ? this.filesService.getFileUrl(publicacion.imagen_url) : null, 
        usuario: usuarioInfo,
      };
    }));

    return publicacionesConUsuario;
  }
}

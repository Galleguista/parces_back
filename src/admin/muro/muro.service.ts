import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicacion } from './entities/publicacion.entity';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class MuroService {
  constructor(
    @InjectRepository(Publicacion)
    private publicacionRepository: Repository<Publicacion>,
    private usersService: UsersService,
  ) {}

  async createPublicacion(createPublicacionDto: CreatePublicacionDto, usuarioId: string): Promise<any> {
    const newPublicacion = this.publicacionRepository.create({ ...createPublicacionDto, usuario_id: usuarioId });
  
    // Convertir la imagen a Buffer si está presente
    if (createPublicacionDto.imagen_url) {
      newPublicacion.imagen_url = Buffer.from(createPublicacionDto.imagen_url);
    }
  
    const savedPublicacion = await this.publicacionRepository.save(newPublicacion);
  
    // Obtener los detalles del usuario
    const usuario = await this.usersService.findById(usuarioId);
    const usuarioInfo = usuario ? {
      nombre: usuario.nombre || 'Anonymous',
      avatar: usuario.avatar ? usuario.avatar.toString('base64') : null,
    } : {
      nombre: 'Anonymous',
      avatar: null,
    };
  
    return {
      ...savedPublicacion,
      usuario: usuarioInfo,
      imagen_url: savedPublicacion.imagen_url ? savedPublicacion.imagen_url.toString('base64') : null,
    };
  }
  

  async findAllPublicaciones(): Promise<any[]> {
    const publicaciones = await this.publicacionRepository.find({ order: { fecha_publicacion: 'DESC' } });

    // Convertir el buffer de imagen a base64 y agregar detalles del usuario
    const publicacionesConUsuario = await Promise.all(publicaciones.map(async (publicacion) => {
      const usuario = await this.usersService.findById(publicacion.usuario_id);
      const usuarioInfo = usuario ? {
        nombre: usuario.nombre || 'Anonymous',
        avatar: usuario.avatar ? usuario.avatar.toString('base64') : null,
      } : {
        nombre: 'Anonymous',
        avatar: null,
      };
      return {
        ...publicacion,
        imagen_url: publicacion.imagen_url ? publicacion.imagen_url.toString('base64') : null,
        usuario: usuarioInfo,
      };
    }));

    return publicacionesConUsuario;
  }
}

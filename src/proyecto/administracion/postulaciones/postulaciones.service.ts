import { Injectable } from '@nestjs/common';
import { CreatePostulacioneDto } from './dto/create-postulacione.dto';
import { UpdatePostulacioneDto } from './dto/update-postulacione.dto';

@Injectable()
export class PostulacionesService {
  create(createPostulacioneDto: CreatePostulacioneDto) {
    return 'This action adds a new postulacione';
  }

  findAll() {
    return `This action returns all postulaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postulacione`;
  }

  update(id: number, updatePostulacioneDto: UpdatePostulacioneDto) {
    return `This action updates a #${id} postulacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} postulacione`;
  }
}

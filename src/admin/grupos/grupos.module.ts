import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { Usuario } from 'src/users/entity/usuario.entity';
import { GrupoService } from './grupos.service';
import { GrupoController } from './grupos.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Grupo, GrupoMiembro, Usuario])],
    controllers: [GrupoController],
    providers: [GrupoService],
    exports: [GrupoService],
})
export class GrupoModule {}

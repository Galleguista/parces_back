import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Scopes } from 'src/system/scope/guards/scope.decorator';
import { ScopesGuard } from 'src/system/scope/guards/scope.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}


  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createProyectoDto: CreateProyectoDto, @Request() req: any) {
    const usuario_id = req.user.sub; // Extrae el ID del usuario desde `sub`

    if (!usuario_id) {
      throw new Error('El usuario_id no se encuentra en el token.');
    }

    return this.proyectoService.create(createProyectoDto, usuario_id);
  }
  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(id);
  }

  @UseGuards(ScopesGuard)
  @Scopes('6cda5af1-baf9-4ee3-9e5c-bf66d7e3a43c')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectoService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(id);
  }
}

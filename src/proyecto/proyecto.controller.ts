import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
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
    console.log('Header Authorization:', req.headers.authorization); // Verifica que el token esté presente y en el formato correcto
    if (!req.user.usuario_id) {
      throw new UnauthorizedException('El usuario_id no se encuentra en el token.');
    }
    return this.proyectoService.create(createProyectoDto, req.user.usuario_id);
  }

  // Listar miembro
  @UseGuards(JwtAuthGuard)
  @Get(':proyecto_id/miembros')
  async getMembersOfProyecto(@Param('proyecto_id') proyecto_id: string) {
    return this.proyectoService.getMembersWithAdmin(proyecto_id);
  }
  
  // Añadir miembro
  @UseGuards(JwtAuthGuard)
  @Post(':proyecto_id/miembro')
  async addMember(
    @Param('proyecto_id') proyectoId: string,
    @Body('usuario_id') usuarioId: string,
    @Request() req: any,
  ) {
    const currentUserId = req.user.usuario_id; // Usuario autenticado extraído del JWT
    return this.proyectoService.addMember(proyectoId, usuarioId, currentUserId);
  }

  // Obtener miembro por ID
  @UseGuards(JwtAuthGuard)
  @Get(':proyecto_id/miembro/:usuario_id')
  async getMember(
    @Param('proyecto_id') proyectoId: string,
    @Param('usuario_id') usuarioId: string,
    @Request() req: any,
  ) {
    return this.proyectoService.getMember(proyectoId, usuarioId);
  }

  // Actualizar miembro (ejemplo: rol dentro del proyecto)
  @UseGuards(JwtAuthGuard)
  @Patch(':proyecto_id/miembro/:usuario_id')
  async updateMember(
    @Param('proyecto_id') proyectoId: string,
    @Param('usuario_id') usuarioId: string,
    @Body() updateData: any,
    @Request() req: any,
  ) {
    const currentUserId = req.user.usuario_id; // Usuario autenticado extraído del JWT
    return this.proyectoService.updateMember(proyectoId, usuarioId, updateData, currentUserId);
  }

  // Eliminar miembro
  @UseGuards(JwtAuthGuard)
  @Delete(':proyecto_id/miembro/:usuario_id')
  async removeMember(
    @Param('proyecto_id') proyectoId: string,
    @Param('usuario_id') usuarioId: string,
    @Request() req: any,
  ) {
    const currentUserId = req.user.usuario_id; // Usuario autenticado extraído del JWT
    return this.proyectoService.removeMember(proyectoId, usuarioId, currentUserId);
  }

  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }
  
  @Post(':proyecto_id/bitacora')
  async addBitacora(
    @Param('proyecto_id') proyecto_id: string,
    @Body('descripcion') descripcion: string,
    @Body('complemento') complemento?: any,
  ) {
    console.log('proyecto_id recibido desde el frontend es este:', proyecto_id)
    return this.proyectoService.addBitacora(proyecto_id, descripcion, complemento);
  }

  // Endpoint para obtener todas las entradas de la bitácora
  @Get(':proyecto_id/bitacora')
  async getBitacoras(@Param('proyecto_id') proyecto_id: string) {
    console.log('GET /:proyecto_id/bitacora', proyecto_id);
    const bitacoras = await this.proyectoService.getBitacoras(proyecto_id);
    console.log('Resultados:', bitacoras);
    return bitacoras;
  }
  
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, ScopesGuard )
  @Scopes('6cda5af1-baf9-4ee3-9e5c-bf66d7e3a43c')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectoService.update(id, updateProyectoDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(id);
  }
    // Endpoint para añadir una entrada a la bitácora
}

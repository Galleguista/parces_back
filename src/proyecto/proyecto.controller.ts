import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UnauthorizedException, Put } from '@nestjs/common';
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
    const currentUserId = req.user.usuario_id; 
    return this.proyectoService.addMember(proyectoId, usuarioId, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':proyecto_id/miembro/:usuario_id')
  async getMember(
    @Param('proyecto_id') proyectoId: string,
    @Param('usuario_id') usuarioId: string,
    @Request() req: any,
  ) {
    return this.proyectoService.getMember(proyectoId, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':proyecto_id/miembro/:usuario_id')
  async updateMember(
    @Param('proyecto_id') proyectoId: string,
    @Param('usuario_id') usuarioId: string,
    @Body() updateData: any,
    @Request() req: any,
  ) {
    const currentUserId = req.user.usuario_id;
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
    const currentUserId = req.user.usuario_id;
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

  // @UseGuards(JwtAuthGuard, ScopesGuard )

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectoService.update(id, updateProyectoDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(id);
  }
    // Endpoint para añadir una entrada a la bitácora

    @UseGuards(JwtAuthGuard)
    @Post(':proyecto_id/formulario')
    async crearFormulario(
      @Param('proyecto_id') proyectoId: string,
      @Body('preguntas') preguntas: string[],
      @Request() req: any,
    ) {
      return this.proyectoService.crearFormulario(proyectoId, preguntas, req.user.usuario_id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':proyecto_id/postulaciones')
    async listarPostulaciones(@Param('proyecto_id') proyectoId: string, @Request() req: any) {
      return this.proyectoService.listarPostulaciones(proyectoId, req.user.usuario_id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post(':id/postulaciones')
    async crearPostulacion(
      @Param('id') projectId: string,
      @Request() req: any,
      @Body() respuestasDto: { respuestas: { pregunta_id: string; respuesta: string }[] },
    ) {
      const usuarioId = req.user.usuario_id; // Extraer el usuario desde el JWT
      return this.proyectoService.crearPostulacion(projectId, usuarioId, respuestasDto.respuestas);
    }

  
    @UseGuards(JwtAuthGuard)
    @Patch(':proyecto_id/postulacion/:postulacion_id')
    async cambiarEstadoPostulacion(
      @Param('proyecto_id') proyectoId: string,
      @Param('postulacion_id') postulacionId: string,
      @Body('estado') estado: string,
      @Request() req: any,
    ) {
      return this.proyectoService.cambiarEstadoPostulacion(proyectoId, postulacionId, estado, req.user.usuario_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/postulaciones-detalle')
    async getPostulacionesDetalle(@Param('id') projectId: string, @Request() req: any) {
      const usuarioId = req.user.usuario_id; // Extraemos el usuario actual desde el JWT
      return this.proyectoService.getPostulacionesDetalle(projectId, usuarioId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Post(':proyecto_id/postulacion/:postulacion_id/aceptar')
    async aceptarPostulacion(
      @Param('proyecto_id') proyectoId: string,
      @Param('postulacion_id') postulacionId: string,
      @Request() req: any,
    ) {
      const usuarioId = req.user.usuario_id;
      return this.proyectoService.aceptarPostulacion(proyectoId, postulacionId, usuarioId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':proyecto_id/postulacion/:postulacion_id/rechazar')
    async rechazarPostulacion(
      @Param('proyecto_id') proyectoId: string,
      @Param('postulacion_id') postulacionId: string,
      @Request() req: any,
    ) {
      const usuarioId = req.user.usuario_id;
      return this.proyectoService.rechazarPostulacion(proyectoId, postulacionId, usuarioId);
    }
    

}

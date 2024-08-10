import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('eventos')
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createEvento(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.createEvento(createEventoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllEventos() {
    return this.eventosService.getAllEventos();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':eventoId')
  async getEventoById(@Param('eventoId') eventoId: string) {
    return this.eventosService.getEventoById(eventoId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':eventoId')
  async deleteEvento(@Param('eventoId') eventoId: string) {
    return this.eventosService.deleteEvento(eventoId);
  }
}

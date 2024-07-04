import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createEvento(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.createEvento(createEventoDto);
  }

  @Get()
  async getAllEventos() {
    return this.eventosService.getAllEventos();
  }

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
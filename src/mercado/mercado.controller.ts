import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MercadoService } from './mercado.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mercado')
export class MercadoController {
  constructor(private readonly mercadoService: MercadoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createItemDto: CreateItemDto, @Request() req) {
    const usuarioId: string = req.user.usuario_id;
    return this.mercadoService.createItem(createItemDto, usuarioId);
  }

  @Get('items')
  async findAll() {
    return this.mercadoService.findAllItems();
  }
}

import { Controller, Get, Post, Param, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ConversacionService } from './conversacion.service';
import { CreateConversacionDto } from './dto/create-conversacion.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('conversaciones')
export class ConversacionController {
  constructor(private readonly conversacionService: ConversacionService) {}

  @Post()
  create(@Body() createConversacionDto: CreateConversacionDto) {
    return this.conversacionService.create(createConversacionDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id/verify-membership')
  async verifyMembership(
    @Param('id') conversacionId: string,
    @Req() req: any,
  ) {
    const isMember = await this.conversacionService.isUserMember(conversacionId, req.user.usuario_id);
    return { isMember };
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('private-chat')
  async createOrGetPrivateChat(
    @Req() req: any, // Usando el mismo tipo que en otros módulos
    @Body('memberId') memberId: string,
  ) {
    const currentUserId = req.user.usuario_id; // Extrae el ID del usuario autenticado desde el JWT

    console.log('Usuario actual (currentUserId):', currentUserId);
    console.log('Usuario miembro con el que se desea iniciar conversación privada (memberId):', memberId);

    return await this.conversacionService.createOrGetPrivateChat(currentUserId, memberId);
  }
  
  @Get()
  findAll() {
    return this.conversacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversacionService.findOne(id);
  }
}

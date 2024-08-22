import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsUUID()
    @IsNotEmpty()
    chatId: string;

    @IsUUID()
    @IsNotEmpty()
    usuarioId: string;

    @IsString()
    @IsNotEmpty()
    contenido: string;
}

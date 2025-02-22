import { IsString } from "class-validator";

export class CreateNotificationTemplateDto {
    @IsString()
    name: string;

    @IsString()
    content: string;
}

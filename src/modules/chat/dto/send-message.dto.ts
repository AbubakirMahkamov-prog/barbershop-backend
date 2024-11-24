import { IsString } from 'class-validator';

export class SendMessageDto {
    @IsString()
    readonly sender: string;

    @IsString()
    readonly content: string;

    @IsString()
    readonly roomId: string; // Optional: if you want to handle rooms
}

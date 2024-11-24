import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
    private messages: SendMessageDto[] = []; // Store messages in memory (for demo purposes)

    saveMessage(message: SendMessageDto) {
        this.messages.push(message);
        console.log('Message saved:', message);
    }
}

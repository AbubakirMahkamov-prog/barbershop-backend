import { Command } from '../decorators/command.decorator';
import { TelegramService } from '../telegram.service';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class StartCommand {
  constructor(private readonly telegramService: TelegramService) {}
  
  @Command('start')
  execute(msg: any) {
    const chatId = msg.chat.id;
    this.telegramService.sendMessage(chatId, 'Welcome to the bot!');
  }
}

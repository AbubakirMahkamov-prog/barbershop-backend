// src/application/telegram/commands/start.command.ts
import { Command } from '../decorators/command.decorator';
import { TelegramService } from '../telegram.service';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class StartCommand {
  @Inject() private telegram: TelegramService;
  constructor(private readonly telegramService: TelegramService) {}
 
  @Command('start')
  execute(msg: any) {
      const chatId = msg.chat.id;
      console.log(this.telegramService, this.telegram)
    // this.telegramService.sendMessage(chatId, 'Welcome to the bot!');
  }
}
// src/application/telegram/commands/help.command.ts
import { Command } from '../decorators/command.decorator';
import { TelegramService } from '../telegram.service';

export class HelpCommand {
  constructor(private readonly telegramService: TelegramService) {}
  @Command('help')
  execute(msg: any) {
    const chatId = msg.chat.id;
    console.log(this.telegramService)
    this.telegramService.sendMessage(chatId, 'Help command!');
  }
}

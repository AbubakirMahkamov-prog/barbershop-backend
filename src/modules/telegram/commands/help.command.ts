import { Injectable } from "@nestjs/common";
import { Command } from '../decorators/command.decorator';
import { TelegramService } from '../telegram.service';

@Injectable()
export class HelpCommand {
  constructor(private readonly telegramService: TelegramService) {}
  @Command('help')
  execute(msg: any) {
    // const chatId = msg.chat.id;
    console.log(this.telegramService);
    // this.telegramService.sendMessage(chatId, 'Help command!');
  }
}

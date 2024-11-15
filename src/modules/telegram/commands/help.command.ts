import { Injectable } from "@nestjs/common";
import { TelegramService } from '../telegram.service';
import { Message } from "../decorators/message/message.decorator";

@Injectable()
export class HelpCommand {
  constructor(private readonly telegramService: TelegramService) {}
  @Message('help')
  execute(msg: any) {
    // const chatId = msg.chat.id;
    console.log(this.telegramService);
    // this.telegramService.sendMessage(chatId, 'Help command!');
  }
}

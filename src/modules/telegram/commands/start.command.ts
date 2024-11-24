import { USER_STEP } from 'src/modules/user/constants/user-step.enum';
import { Message } from '../decorators/message/message.decorator';
import { TelegramService } from '../telegram.service';
import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from 'src/modules/user/user.service';
import { Command } from '../decorators/message/command.decorator';
import { Message as IMessage, KeyboardButton } from 'node-telegram-bot-api';

@Injectable()
export class StartCommand {
  @Inject() userService: UsersService;
  constructor(private readonly telegramService: TelegramService) {}
  
  @Command({ name: '/start' })
  async execute(msg: IMessage) {
    const chatId = msg.chat.id.toString();
    await this.userService.setStep(chatId, USER_STEP.START);
    const isVerified = await this.userService.checkVerified(chatId);
    if (!isVerified) {
        await this.userService.deleteByChatId(chatId);
        await this.userService.setStep(chatId, USER_STEP.GET_FULLNAME);
        await this.telegramService.sendMessage(chatId, "Assalomu alaykum!");
        await this.telegramService.sendMessage(chatId, "Ismingizni kiriting!");  
    }
  }
  @Message({ step: USER_STEP.GET_FULLNAME })
  async getFullName(msg: IMessage) {
    const chatId = msg.chat.id.toString();
    const { text } = msg;
    await this.userService.update(chatId, { full_name: text });
    const keyboard: KeyboardButton[][] = [
      [ { text: "Telefon raqamingizni jo'nating" , request_contact: true }]
    ]
    await this.telegramService.sendMessageWithKeyboard(chatId, `Telefon raqamingizni kiriting !`, {
      keyboard: keyboard,
      resize_keyboard: true
    });
    this.userService.setStep(chatId, USER_STEP.GET_PHONE);    
  }
}

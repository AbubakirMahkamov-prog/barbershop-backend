import { USER_STEP } from 'src/modules/user/constants/user-step.enum';
import { Message } from '../decorators/message/message.decorator';
import { TelegramService } from '../telegram.service';
import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from 'src/modules/user/user.service';
import { Command } from '../decorators/message/command.decorator';
import { Message as IMessage, KeyboardButton } from 'node-telegram-bot-api';
import { isPhoneNumberValidator } from 'src/shared/utils/is-phone-number';

@Injectable()
export class StartCommand {
  @Inject() userService: UsersService;
  constructor(private readonly telegramService: TelegramService) {}
  
  @Command({ name: '/start' })
  async execute(msg: IMessage) {
    const { chat } = msg;
    const { username } = chat;
    const chatId = msg.chat.id.toString();
    const isVerified = await this.userService.checkVerified(chatId);
    await this.telegramService.sendMessage(chatId, "Assalomu alaykum!");
    if (!isVerified) {
      await this.userService.deleteByChatId(chatId);
      await this.userService.create({
        chat_id: chatId,
        tg_user_name: username
      });
      await this.userService.setStep(chatId, USER_STEP.GET_FULLNAME);
      await this.telegramService.sendMessage(chatId, "Ismingizni kiriting!");  
    } else {
      await this.userService.setStep(chatId, USER_STEP.START);
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
    await this.telegramService.sendMessage(chatId, `Telefon raqamingizni kiriting !`, {
      reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    this.userService.setStep(chatId, USER_STEP.GET_PHONE);    
  }
  @Message({ step: USER_STEP.GET_PHONE })
  async getPhone(msg: IMessage) {
    const chatId = msg.chat.id.toString();
    const { text, contact } = msg;
    const phone_number = text ? text: contact.phone_number;
    const isValid = await isPhoneNumberValidator(phone_number)
    if (!isValid) {
      await this.telegramService.sendMessage(chatId, "Telefon raqam to'g'ri formatda jo'nating. Masalan: (+998941021212)");
    }
    await this.userService.update(chatId, { phone_number })
    await this.telegramService.sendMessage(chatId, "Siz akkountingiz tasdiqlandi !", {
      reply_markup: {
        remove_keyboard: true
      }
    })
    await this.userService.setStep(chatId, USER_STEP.VERIFIED);
  }
 
}

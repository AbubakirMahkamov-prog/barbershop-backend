import { USER_STEP } from 'src/modules/user/constants/user-step.enum';
import { Message } from '../decorators/message/message.decorator';
import { TelegramService } from '../telegram.service';
import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from 'src/modules/user/user.service';
import { Command } from '../decorators/message/command.decorator';
import { Message as IMessage, KeyboardButton } from 'node-telegram-bot-api';
import { isPhoneNumberValidator } from 'src/shared/utils/is-phone-number';
import { messageHelper } from "./constants/message.constant";
import bcrypt from "bcrypt";

@Injectable()
export class RegistrationLogic {
  @Inject() userService: UsersService;
  constructor(private readonly telegramService: TelegramService) {}
  
  @Command({ name: '/start' })
  async execute(msg: IMessage) {
    const { chat } = msg;
    const { username } = chat;
    const chatId = msg.chat.id.toString();
    const isVerified = await this.userService.checkVerified(chatId);
    await this.telegramService.sendMessage(chatId, messageHelper.greeting());
    if (!isVerified) {
      await this.userService.deleteByChatId(chatId);
      await this.userService.create({
        chat_id: chatId,
        tg_user_name: username
      });
      await this.userService.setStep(chatId, USER_STEP.GET_FULLNAME);
      await this.telegramService.sendMessage(chatId, messageHelper.askFullName());  
    } else {
      await this.userService.setStep(chatId, USER_STEP.START);
    }

  }
  @Message({ step: USER_STEP.GET_FULLNAME })
  async getFullName(msg: IMessage) {
    const chatId = msg.chat.id.toString();
    const { text } = msg;
    await this.userService.update(chatId, { full_name: text });
    await this.telegramService.sendMessage(chatId, messageHelper.askPassword())
    this.userService.setStep(chatId, USER_STEP.GET_PASSWORD);    
  }
  @Message({ step: USER_STEP.GET_PASSWORD })
  async getPassword(msg: IMessage) {
    const chatId = msg.chat.id.toString();
    const { text } = msg;
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(text, salt);
    await this.userService.update(chatId, { password })
    const keyboard: KeyboardButton[][] = [
      [ { text: "Telegram raqamini jo'natish" , request_contact: true }]
    ]
    await this.telegramService.sendMessage(chatId, messageHelper.askPhone(), {
      reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    await this.userService.setStep(chatId, USER_STEP.GET_PHONE)
  }
  @Message({ step: USER_STEP.GET_PHONE })
  async getPhone(msg: IMessage) {
    const chatId = msg.chat.id.toString();
    const { text, contact } = msg;
    const phone_number = text ? text: contact.phone_number;
    const isValid = await isPhoneNumberValidator(phone_number)
    if (!isValid) {
      await this.telegramService.sendMessage(chatId, messageHelper.wrongPhoneState());
    }
    await this.userService.update(chatId, { phone_number })
    await this.telegramService.sendMessage(chatId,  messageHelper.verifyAccount() ,{
      reply_markup: {
        remove_keyboard: true
      }
    })
    await this.userService.setStep(chatId, USER_STEP.VERIFIED);
  }
 
}

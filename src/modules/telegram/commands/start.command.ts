import { USER_STEP } from 'src/modules/user/constants/user-step.enum';
import { Message } from '../decorators/message/message.decorator';
import { TelegramService } from '../telegram.service';
import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from 'src/modules/user/user.service';
import { Command } from '../decorators/message/command.decorator';

@Injectable()
export class StartCommand {
  @Inject() userService: UsersService;
  constructor(private readonly telegramService: TelegramService) {}
  
  @Command({ name: '/start' })
  async execute(msg: any) {
    const chatId = msg.chat.id;
    await this.userService.setStep(chatId, USER_STEP.START);
    const isVerified = await this.userService.checkVerified(chatId);
    if (!isVerified) {
        this.userService.setStep(chatId, USER_STEP.GET_FULLNAME);
        this.telegramService.sendMessage(chatId, "Assalomu alaykum!");
        this.telegramService.sendMessage(chatId, "Ismingizni kiriting!");  
    }
  }
  @Message({ step: USER_STEP.GET_FULLNAME })
  async getFullName(msg) {
    const chatId = msg.chat.id;
    const { text } = msg;
    const user = await this.userService.create({ full_name: text });
    this.telegramService.sendMessage(chatId, `Telefon raqamingizni kiriting !`);
    this.userService.setStep(chatId, USER_STEP.GET_PHONE);

    console.log(user);
    
  }
}

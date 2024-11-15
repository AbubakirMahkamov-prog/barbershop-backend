import { USER_STEP } from 'src/modules/user/constants/user-step.enum';
import { Message } from '../decorators/message/message.decorator';
import { TelegramService } from '../telegram.service';
import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from 'src/modules/user/user.service';

@Injectable()
export class StartCommand {
  @Inject() userService: UsersService;
  constructor(private readonly telegramService: TelegramService) {}
  
  @Message('/start')
  async execute(msg: any) {
    const chatId = msg.chat.id;
    await this.userService.setStep(chatId, USER_STEP.START);
    const isVerified = await this.userService.checkVerified(chatId);
    if (!isVerified) {
      this.telegramService.sendMessage(chatId, "Assalomu alaykum!");
      this.telegramService.sendMessage(chatId, "Ismingizni kiriting!");
    }
  }
  @Message('test')
  test(msg: any) {
    const chatId = msg.chat.id;
    this.telegramService.sendMessage(chatId, 'Welcome to the test!');
  }
}

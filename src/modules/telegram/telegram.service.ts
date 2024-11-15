import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core'; // Import ModuleRef
import TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import { MessageHandler } from './decorators/message/message-handler.decorator';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    this.bot = new TelegramBot(configService.get<string>('BOT_TOKEN'), { polling: true });
  }

  onModuleInit() {
    this.initializeBot();
  }

  private async initializeBot() {
    const messageClasses = MessageHandler.getMessages();
    this.bot.on('message', async (msg) => {
      const { text } = msg;
      const handlers = messageClasses[text]
      for (const handler of handlers) {
        const MessageClass = handler.class;
        const messageInstance = await this.moduleRef.create(MessageClass);
        messageInstance[handler.methodName](msg)
      }
    })
  }

  sendMessage(chatId: number, text: string) {
    this.bot.sendMessage(chatId, text);
  }
}

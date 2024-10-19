import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot  from 'node-telegram-bot-api';
import { CommandHandler } from './decorators/command-handler.decorator';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(private readonly configService: ConfigService) {
    this.bot = new TelegramBot(configService.get<string>('BOT_TOKEN'), { polling: true });
  }

  onModuleInit() {
    this.initializeBot();
  }

  private initializeBot() {
    // Register command handlers
    const commands = CommandHandler.getCommands();
    Object.keys(commands).forEach((command) => {
      this.bot.onText(new RegExp(`/${command}`), (msg) => {
        commands[command](msg);
      });
    });
  }

  sendMessage(chatId: number, text: string) {
    this.bot.sendMessage(chatId, text);
  }
}

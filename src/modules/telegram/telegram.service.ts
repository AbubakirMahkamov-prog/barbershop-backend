import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot  from 'node-telegram-bot-api';
import { CommandHandler } from './decorators/command-handler.decorator';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot('7835154864:AAHcJDxPKvfY1ijLh0fs9KYp1m6j_J4HRhA', { polling: true });
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

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core'; // Import ModuleRef
import TelegramBot from 'node-telegram-bot-api';
import { CommandHandler } from './decorators/command-handler.decorator';
import { ConfigService } from '@nestjs/config';

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
    const commandClasses = CommandHandler.getCommands();
    for (const command of Object.keys(commandClasses)) {
      const CommandClass = commandClasses[command];
      const commandInstance = await this.moduleRef.create(CommandClass);

      this.bot.onText(new RegExp(`/${command}`), (msg) => {
        commandInstance.execute(msg);
      });
    }
  }

  sendMessage(chatId: number, text: string) {
    this.bot.sendMessage(chatId, text);
  }
}

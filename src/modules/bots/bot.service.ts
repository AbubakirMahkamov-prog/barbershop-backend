import { Injectable, Inject } from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigType } from '@nestjs/config';
import botConfig from '../config/bot.config';
import {
  handleBot1Command,
  handleBot2Command,
  logMessages,
} from './bot.handlers';

@Injectable()
export class BotService {
  private bots: Record<string, Bot>;

  constructor(
    @Inject(botConfig.KEY) private config: ConfigType<typeof botConfig>,
  ) {
    this.bots = {};
    this.initializeBots();
  }

  private initializeBots() {
    // Initialize multiple bots
    const bot1 = new Bot(this.config.token);
    const bot2 = new Bot('ANOTHER_BOT_TOKEN'); // Add your second bot token here

    this.bots['bot1'] = bot1;
    this.bots['bot2'] = bot2;

    // Setup webhook and middleware
    this.setupWebhook(bot1);
    this.setupWebhook(bot2);
  }

  private setupWebhook(bot: Bot) {
    bot.use(logMessages);
    bot.use(handleBot1Command); // Use specific handlers for bot 1
    bot.api.setWebhook(this.config.webhookUrl); // Set webhook URL for the bot
  }

  public getBot(botName: string): Bot {
    return this.bots[botName];
  }
}

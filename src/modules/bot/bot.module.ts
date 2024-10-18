
import { Module } from '@nestjs/common';
import { TelegrafModule } from "nestjs-telegraf";
import { BotService } from "./bot.service";
import { ConfigService } from '@nestjs/config';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    SharedModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService
      botName: "bot",
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
        launchOptions: {
          webhook: {
            domain: configService.get<string>('WEB_HOOK_URL'), 
            path: '/bot',
          }
        }
      }),
    }),
  ],
  providers: [BotService]
})
export class BotModule {}

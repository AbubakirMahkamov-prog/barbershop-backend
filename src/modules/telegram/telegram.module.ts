import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { HelpCommand } from './commands/help.command';
import { StartCommand } from './commands/start.command';

@Module({
  imports: [],
  providers: [TelegramService, HelpCommand, StartCommand],
  exports: [TelegramService],
})
export class TelegramModule {}

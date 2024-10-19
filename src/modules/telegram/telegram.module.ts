import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { HelpCommand } from './commands/help.command';
import { StartCommand } from './commands/start.command';
import { SharedModule } from "../../shared/shared.module";
@Module({
  imports: [SharedModule],
  providers: [TelegramService, HelpCommand, StartCommand],
  exports: [TelegramService],
})
export class TelegramModule {}

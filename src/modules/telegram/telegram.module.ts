import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { RegistrationLogic } from './logics/registration.logic';
import { SharedModule } from "../../shared/shared.module";
import { UsersModule } from '../user/user.module';
@Module({
  imports: [SharedModule, UsersModule],
  providers: [TelegramService, RegistrationLogic],
  exports: [TelegramService],
})
export class TelegramModule {}

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './modules/user/user.module'
import { TelegramModule } from './modules/telegram/telegram.module'
import { ChatModule } from './modules/chat/chat.module'
import { LoggerModule } from './middleware/logger/logger.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    SharedModule, 
    UsersModule, 
    ChatModule,
    TelegramModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply logger middleware to all routes
  }
}

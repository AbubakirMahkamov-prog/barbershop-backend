import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middleware/filters/http-exception.filter';
import { getBotToken } from "nestjs-telegraf";
import { ConfigService } from '@nestjs/config'; // Import ConfigService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Get the ConfigService
  const configService = app.get(ConfigService);
  
  // Get the port from ConfigService (use default 3000 if not specified)
  const port = configService.get<number>('PORT') || 3000;
	const mock_int = app.get(getBotToken('bot'))
	app.use(mock_int.webhookCallback('/bot'))
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}

bootstrap();

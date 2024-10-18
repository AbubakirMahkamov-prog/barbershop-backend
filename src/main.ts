import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middleware/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Get the ConfigService
  const configService = app.get(ConfigService);
  
  // Get the port from ConfigService (use default 3000 if not specified)
  const port = configService.get<number>('PORT') || 3000;
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}

bootstrap();

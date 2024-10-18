import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseService } from './providers/mongoose.service'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [MongooseService],
  exports: [MongooseService]
})
export class SharedModule {}

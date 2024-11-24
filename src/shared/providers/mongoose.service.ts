import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import mongoose from "mongoose";

@Injectable()
export class MongooseService implements OnModuleInit {
  instance: mongoose.Mongoose;

  constructor(private configService: ConfigService) {
    this.instance = mongoose;
  }
  async onModuleInit() {
    const uri = `mongodb://${this.configService.get<string>('MONGO_USER')}:${this.configService.get<string>('MONGO_PASSWORD')}@${this.configService.get<string>('MONGO_HOST')}:${this.configService.get<string>('MONGO_PORT')}/${this.configService.get<string>('MONGO_DATABASE')}?authSource=admin`;
    try {
      await this.instance.connect(uri);
      console.log('Mongoose connected successfully');
    } catch (err) {
      console.error('Mongoose connection error:', err);
    }
  }
}

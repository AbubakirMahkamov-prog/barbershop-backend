import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { SharedModule } from '../../shared/shared.module'; // Import the SharedModule


@Module({
  imports: [SharedModule], // Import the SharedModule to access MongooseService
  controllers: [UsersController],  // Register the UsersController
  providers: [
    UsersService,                   // Register the UsersService
  ],
})
export class UsersModule {}

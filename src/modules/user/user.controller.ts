import { Body, Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  @HttpCode(HttpStatus.CREATED) // Set HTTP status to 201 for successful creation
  async create(@Body() user: Partial<User>) {
    return this.usersService.create(user);
  }

  // Retrieve all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}

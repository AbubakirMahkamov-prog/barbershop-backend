import { Injectable } from '@nestjs/common';
import { MongooseService } from '../../shared/providers/mongoose.service';
import { User, UserSchema } from './user.schema';

@Injectable()
export class UsersService {
  private userModel;

  constructor(private readonly mongooseService: MongooseService) {
    this.userModel = this.mongooseService.instance.model<User>('User', UserSchema);
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}

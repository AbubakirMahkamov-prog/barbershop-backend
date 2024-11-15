import { Injectable } from '@nestjs/common';
import { MongooseService } from '../../shared/providers/mongoose.service';
import { User, UserSchema } from './user.schema';
import { Model } from 'mongoose';
import { ManageStep, ManageStepSchema } from './manage-step.schema';
import { USER_STEP } from './constants/user-step.enum';
import { isEmpty } from 'lodash';

@Injectable()
export class UsersService {
  private userModel: Model<User>;
  private manageStepModel: Model<ManageStep>;
  constructor(private readonly mongooseService: MongooseService) {
    this.userModel = this.mongooseService.instance.model<User>('User', UserSchema);
    this.manageStepModel = this.mongooseService.instance.model<ManageStep>('ManageStep', ManageStepSchema);
  }
  getUserStep(chatId: string) {
    return this.manageStepModel.findOne({
      chat_id: chatId
    }).exec()
  }
  async setStep(chatId: string, step: USER_STEP) {
    const model = await this.manageStepModel.findOne({chat_id: chatId});
    
    if (isEmpty(model)) {
      await this.manageStepModel.create({
        chat_id: chatId,
        step
      })
    } else {
      await this.manageStepModel.updateOne({
        chat_id: chatId
      }, {
        step
      })
    }
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}

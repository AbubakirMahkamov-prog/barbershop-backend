import { Injectable, Inject } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf, Context, Markup } from "telegraf";
import fsPromise from 'fs/promises';
import fs from 'fs';
import { BotBaseService } from '../../shared/providers/bot-base.service'
import { MongooseService } from '../../shared/providers/mongoose.service'
import { BOTSTEPS } from "./constants/step.enum";
import { BotMessages } from "./constants/messages.constant";
import { User, UserSchema } from '../user/user.schema';


@Injectable()
export class BotService extends BotBaseService {
 private userModel;
 

 constructor(@InjectBot("bot") bot: Telegraf, private readonly mongooseService: MongooseService) {
   super('bot.step.json', bot);
   this.userModel = this.mongooseService.instance.model<User>('User', UserSchema);
   this.initRefactor()
 }
 
 private initRefactor() {
  const bot = this.getBot()
  bot.command('start', async (ctx: any) => {
    const { username, first_name, last_name } = ctx.from;
    const fullName = first_name + ' ' + last_name;
    const chatId = ctx.chat.id;
    await this.setUserStep(chatId, BOTSTEPS.START);
    const user = await this.userModel.findOne({
      chat_id: chatId,
    })
    const markup = Markup.keyboard([
      [{ text: 'Send Contact', request_contact: true }]
    ]).resize(true);
    if (!user) {
      await this.userModel.create({
        chat_id: chatId,
        tg_user_name: username,
        full_name: fullName
      })
      
      await this.sendMessage(chatId, BotMessages.startWithPhone(fullName), markup);
      return;
    }
    await this.sendMessage(chatId, BotMessages.start(fullName), markup);
    
  });
  //message handler
   bot.on('message', async (ctx: any) => {
    const chatId = ctx.message.chat.id;
    const currentStep = await this.getUserStep(chatId);
  })

 }
}
////    
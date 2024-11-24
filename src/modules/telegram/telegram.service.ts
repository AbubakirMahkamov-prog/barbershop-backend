import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core'; // Import ModuleRef
import TelegramBot, { KeyboardButton, Message, ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import { MessageHandler } from './decorators/message/message-handler.decorator';
import { CommandHandler } from './decorators/message/command-handler.decorator';
import { UsersService } from '../user/user.service';
import { isEmpty } from 'lodash';
@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  @Inject() userService: UsersService;
  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    this.bot = new TelegramBot(configService.get<string>('BOT_TOKEN'), { polling: true });
  }

  onModuleInit() {
    this.initializeBot();
  }

  private async initializeBot() {
    this.bot.on('message', async (msg) => {
      const { text, entities } = msg;
      const messageType = entities && entities[0].type == 'bot_command' ? 'command':'text';
      switch(messageType) {
        case 'command':
          this.commandHandler(msg)
          break;
        case 'text':
        this.messageHandler(msg);
      }  
    })
  }
  private async commandHandler(msg: Message) {
    const { text } = msg;
    const handlerClasses = CommandHandler.getCommands();
    const handlers = handlerClasses[text];
    for (const handler of handlers) {
      const CommandClass = handler.class;
      const commandInstance = await this.moduleRef.create(CommandClass);
      commandInstance[handler.methodName](msg);
    }
  }
  private async messageHandler(msg: Message) {
    const { text } = msg;
    const handlerClasses = MessageHandler.getHandlers();
    const noStepHandlersClasses = MessageHandler.getNoStepHandlers();
    const noNameHandlersClasses = MessageHandler.getNoNameHandlers();
    const anyHandlersClasses = MessageHandler.getAnyHandlers();
    const handlers = handlerClasses[text];
      const chatId = msg.chat.id;
      const chat = await this.userService.getUserStep(chatId.toString());
      if(!isEmpty(handlers)) {
      for (const handler of handlers) {
        const MessageClass = handler.class;
        const messageInstance = await this.moduleRef.create(MessageClass);
        if (chat.step != handler.step.toString() ) {
          continue;
        }
        messageInstance[handler.methodName](msg)
      } 
      }
      const noStepHandlers = noStepHandlersClasses[text];
      if(!isEmpty(noStepHandlers)) {
        for (const handler of noStepHandlers) {
          const MessageClass = handler.class;
          const messageInstance = await this.moduleRef.create(MessageClass);
          messageInstance[handler.methodName](msg)
        } 
      }
      
      const noNameHandlers = noNameHandlersClasses[chat.step];
      if(!isEmpty(noNameHandlers)) {
        for (const handler of noNameHandlers) {
          const MessageClass = handler.class;
          const messageInstance = await this.moduleRef.create(MessageClass);
          messageInstance[handler.methodName](msg)
        } 
      }
      const anyHandlers = anyHandlersClasses;
      for (const handler of anyHandlers) {
        const MessageClass = handler.class;
        const messageInstance = await this.moduleRef.create(MessageClass);
        messageInstance[handler.methodName](msg)
      }
  }

  sendMessage(chatId: string, text: string) {
    this.bot.sendMessage(chatId, text);
  }
  sendMessageWithKeyboard(chatId: string, text: string, reply_markup: ReplyKeyboardMarkup) {
    this.bot.sendMessage(chatId, text, {
      reply_markup:  reply_markup,
    })
  }
}

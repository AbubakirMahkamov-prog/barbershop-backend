import { Injectable } from '@nestjs/common';

type MessageHandlerClass = { new (...args: any[]): any };

@Injectable()
export class MessageHandler {
  private static handlers: { [key: string]: {
    class: MessageHandlerClass,
    methodName: any
  }[] } = {};

  static addHandler(name: string, methodName: any, handlerClass: MessageHandlerClass) {
    if (this.handlers) {
        this.handlers[name] = [{
            class: handlerClass,
            methodName: methodName
        }]
    } else {
        this.handlers[name].push({
            class: handlerClass,
            methodName: methodName
        });
    }
  }

  static getMessages() {
    return this.handlers;
  }
}

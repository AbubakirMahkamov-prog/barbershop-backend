import { Injectable } from '@nestjs/common';

type CommandHandlerClass = { new (...args: any[]): any };

@Injectable()
export class CommandHandler {
  private static commands: { [key: string]: {
    class: CommandHandlerClass,
    methodName: string;
  }[] } = {};
  static addCommand(methodName: any, handlerClass: CommandHandlerClass, name: string) {
    if (this.commands) {
        this.commands[name] = [{
            class: handlerClass,
            methodName: methodName
        }]
    } else {
          this.commands[name].push({
              class: handlerClass,
              methodName: methodName
          });
      } 
  }

  static getCommands() {
    return this.commands;
  }
}

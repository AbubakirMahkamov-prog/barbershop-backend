import { Injectable } from '@nestjs/common';

type CommandHandlerClass = { new (...args: any[]): any };

@Injectable()
export class CommandHandler {
  private static commands: { [key: string]: CommandHandlerClass } = {};

  static addCommand(name: string, handlerClass: CommandHandlerClass) {
    this.commands[name] = handlerClass;
  }

  static getCommands() {
    return this.commands;
  }
}

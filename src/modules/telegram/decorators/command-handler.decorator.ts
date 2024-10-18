// src/application/telegram/decorators/command-handler.decorator.ts
type CommandHandlerFn = (msg: any) => void;

export class CommandHandler {
  private static commands: { [key: string]: CommandHandlerFn } = {};

  static addCommand(name: string, handler: CommandHandlerFn) {
    this.commands[name] = handler;
  }

  static getCommands() {
    return this.commands;
  }
}

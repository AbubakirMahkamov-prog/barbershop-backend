// src/application/telegram/decorators/command.decorator.ts
import { CommandHandler } from './command-handler.decorator';

export function Command(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    CommandHandler.addCommand(name, descriptor.value);
  };
}

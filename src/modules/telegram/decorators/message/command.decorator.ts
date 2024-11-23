import { CommandHandler } from './command-handler.decorator';

export function Command(data: { name: string}) {
  const { name } = data;
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const methodName = propertyKey;
    CommandHandler.addCommand(methodName, target.constructor, name);
  };
}

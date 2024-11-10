import { MessageHandler } from './message-handler.decorator';

export function Message(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const methodName = propertyKey;
    MessageHandler.addHandler(name, methodName, target.constructor);
  };
}

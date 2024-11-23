import { MessageHandler } from './message-handler.decorator';

export function Message(data: { name?: string, step?: number }) {
  const { name, step } = data;
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const methodName = propertyKey;
    MessageHandler.addHandler(methodName, target.constructor, name, step);
  };
}

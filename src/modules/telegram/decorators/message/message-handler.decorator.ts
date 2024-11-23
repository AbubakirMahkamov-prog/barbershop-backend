import { Injectable } from '@nestjs/common';

type MessageHandlerClass = { new (...args: any[]): any };

@Injectable()
export class MessageHandler {
  private static handlers: { [key: string]: {
    class: MessageHandlerClass,
    step: number;
    methodName: string;
  }[] } = {};
  private static noStepHandlers: {
    [key: string]: { class: MessageHandlerClass, methodName: string }[] ;
  } = {};
  private static noNameHandlers: {
    [key: string]: {
      class: MessageHandlerClass,
      methodName: string
    }[]
  } = {};
  private static anyHandlers: {  class: MessageHandlerClass, methodName: string }[] = [];
  static addHandler(methodName: any, handlerClass: MessageHandlerClass, name?: string, step?: number) {
    if (name && step) {
      if (this.handlers) {
        this.handlers[name] = [{
            class: handlerClass,
            step: step,
            methodName: methodName
        }]
    } else {
          this.handlers[name].push({
              class: handlerClass,
              step: step,
              methodName: methodName
          });
      } 
    } 
    
    else if(name && !step) {
      if (this.noStepHandlers) {
        this.noStepHandlers[name] = [{
          class: handlerClass,
          methodName
      }]
      } else {
        this.noStepHandlers[name].push({
          class: handlerClass,
          methodName
        })
      }
    }
    else if(!name && step) {
      if (this.noNameHandlers) {
        this.noNameHandlers[step] = [{
          class: handlerClass,
          methodName
      }]
      } else {
        this.noNameHandlers[step].push({
          class: handlerClass,
          methodName
        })
      }
    }
    else {
      this.anyHandlers.push({ class: handlerClass, methodName });
    }
  }

  static getHandlers() {
    return this.handlers;
  }
  static getNoStepHandlers() {
    return this.noStepHandlers;
  }
  static getNoNameHandlers() {
    return this.noNameHandlers;
  }
  static getAnyHandlers() {
    return this.anyHandlers;
  }
}

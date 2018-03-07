import { methods, statics } from './data';


export function TSGooseMethod(options: ITSGooseMethodOptions = {}) {

  return function(target: any, propertyKey: string) {

    const name = target.constructor.name;

    const methodsContainer: any = options.isStatic ? statics : methods;

    methodsContainer[name] = methodsContainer[name] || {};
    methodsContainer[name][propertyKey] = target[propertyKey];

  };

}

export interface ITSGooseMethodOptions {
  isStatic?: boolean;
}

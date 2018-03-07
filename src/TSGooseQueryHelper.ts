import { queryHelpers } from './data';

export function TSGooseQueryHelper(options: ITSGooseQueryHelperOptions = {}) {

  return function(target: any, propertyKey: string) {

    const name = target.constructor.name;

    queryHelpers[name] = queryHelpers[name] || [];

    queryHelpers[name].push({
      name: options.name || propertyKey,
      method: target[propertyKey]
    });

  };

}

export interface ITSGooseQueryHelperOptions {
  name?: string;
}


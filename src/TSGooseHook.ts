import { postHooks, preHooks } from './data';
import { ITSGooseHookOptions, TSGooseHookType } from './declarations';


export function TSGooseHook(options: ITSGooseHookOptions) {

  return function (target: any, propertyKey: string) {

    const name = target.constructor.name;

    const hookRepo = options.type === TSGooseHookType.Pre ? preHooks : postHooks;

    hookRepo[name] = hookRepo[name] || [];

    hookRepo[name].push({
      name: options.name,
      method: target[propertyKey]
    });

    // console.log(hookRepo);

  };

}

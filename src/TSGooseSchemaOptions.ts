import { SchemaOptions } from 'mongoose';
import { schemaOptions } from './data';


export function TSGooseSchemaOptions(options: SchemaOptions) {

  return function(target: any) {

    const name = target.name;
    schemaOptions[name] = options;

    return target;

  };
}

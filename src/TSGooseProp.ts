import * as mongoose from 'mongoose';
import { schemas, virtuals } from './data';
import { ITSGoosePropOptions } from './declarations';
import { getTSGooseModel, getTSGooseSchema } from './TSGoose';

const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PRIMITIVES = ['String', 'Number', 'Boolean', 'Date'];

const isPrimitive = (type: any): boolean => PRIMITIVES.indexOf(type.name) > -1;

const isTSGoose = (type: any): boolean => {
  let prototype = type.prototype;
  let name = type.name;

  while (name) {

    if (name === 'TSGoose') {
      return true;
    }

    prototype = Object.getPrototypeOf(prototype);
    name = prototype ? prototype.constructor.name : null;
  }

  return false;
};


export function TSGooseProp(options: ITSGoosePropOptions = {}) {
  // console.log('TSGooseProp options', options);

  return function (target: any, propertyKey: string) {

    const name = target.constructor.name;

    let type = Reflect.getMetadata('design:type', target, propertyKey);

    const isVirtual = Object.getOwnPropertyDescriptor(target, propertyKey);

    if (isVirtual) {

      virtuals[name] = virtuals[name] || [];
      virtuals[name].push({
        name: propertyKey,
        get: isVirtual.get, //tslint:disable-line
        set: isVirtual.set  //tslint:disable-line
      });

      return;
    }

    const isArray = type === Array;

    if (isArray) {
      if (!options.arrayType) {
        throw new Error('Property is array. Please define array type in prop options `arrayType`.');
      }

      type = options.arrayType;
    }

    if (options.enum) {

      options.enum = Object.keys(options.enum).map((key: string) => options.enum[key]);
      type = String;
    }

    schemas[name] = schemas[name] || {};
    const schema = schemas[name];

    let mongooseDef: any = {type};

    if (isPrimitive(type)) {

      if (isArray) {
        mongooseDef.type = [mongooseDef.type];
      }

      const extraOptions = {...options};
      delete extraOptions.arrayType;
      delete extraOptions.ref;

      Object.assign(mongooseDef, extraOptions);

    } else {

      if (isTSGoose(type)) {

        getTSGooseModel(type);

        if (options.ref) {
          mongooseDef.type = ObjectId;
          mongooseDef.ref = type.name;
        } else {
          mongooseDef = getTSGooseSchema(type);
        }

      } else {
        mongooseDef.type = Mixed;
      }

      if (isArray) {
        mongooseDef = [mongooseDef];
      }

    }

    schema[propertyKey] = mongooseDef;

  };
}



import 'reflect-metadata';
import {
  methods, models, postHooks, preHooks, queryHelpers, schemaOptions, schemas, schemasInstances, statics,
  virtuals
} from './data';
import * as mongoose from 'mongoose';
import {ITSGooseHookLikeEntry, ITSGooseVirtualEntry, TSGooseModel} from './declarations';

export class TSGoose {

  static getTSGooseModel<T>(): TSGooseModel<T> {
    return getTSGooseModel<T>(this);
  }




}

export function getTSGooseSchema(t: any): mongoose.Schema {

  const name = t.name;

  if (!schemasInstances[name]) {
    const schemaDef = schemas[name];

    schemasInstances[name] = new mongoose.Schema(schemaDef, schemaOptions[name]);
    const schema = schemasInstances[name];

    if (methods[name]) {
      for (const methodPropertyKey in methods[name]) {
        if (methods[name].hasOwnProperty(methodPropertyKey)) {
          schema.methods[methodPropertyKey] = methods[name][methodPropertyKey];
        }
      }
    }

    if (statics[name]) {
      for (const methodPropertyKey in statics[name]) {
        if (statics[name].hasOwnProperty(methodPropertyKey)) {
          schema.statics[methodPropertyKey] = statics[name][methodPropertyKey];
        }
      }
    }


    if (preHooks[name]) {
      preHooks[name].forEach((hookEntry: ITSGooseHookLikeEntry) => {
        schema.pre(hookEntry.name, hookEntry.method);
      });
    }

    if (postHooks[name]) {
      postHooks[name].forEach((hookEntry: ITSGooseHookLikeEntry) => {
        schema.post(hookEntry.name, hookEntry.method);
      });
    }

    if (queryHelpers[name]) {
      queryHelpers[name].forEach((qEntry: ITSGooseHookLikeEntry) => {
        (schema as any).query[qEntry.name] = qEntry.method;
      });
    }

    if (virtuals[name]) {
      virtuals[name].forEach((virtual: ITSGooseVirtualEntry) => {
        if (virtual.get) {
          schema.virtual(virtual.name).get(virtual.get);
        }
        if (virtual.set) {
          schema.virtual(virtual.name).set(virtual.set);
        }
      });
    }

  }

  return schemasInstances[name];

}

export function getTSGooseModel<T>(t: any): TSGooseModel<T> {

  const name = t.name;

  if (!models[name]) {
    const schema = getTSGooseSchema(t);
    models[name] = mongoose.model(name, schema);
  }

  return models[name];

}

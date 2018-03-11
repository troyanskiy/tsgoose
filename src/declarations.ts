import * as mongoose from 'mongoose';

export type Func = (...args: any[]) => any;
export type RequiredType = boolean | [boolean, string] | string | Func | [Func, string];

export interface ITSGoosePropOptions {
  arrayType?: any;
  ref?: any;
  enum?: any;

  required?: RequiredType;
  default?: any;
  unique?: boolean;
  index?: boolean;
  sparse?: boolean;
  expires?: string | number;

  min?: number | [number, string];
  max?: number | [number, string];

  minlength?: number | [number, string];
  maxlength?: number | [number, string];
  match?: RegExp | [RegExp, string];
}

export interface ITSGooseHookLikeEntry {
  name: string;
  method: any;
}

export interface ITSGooseVirtualEntry {
  name: string;
  get: any;
  set: any;
}


export type TSGooseDocument<T> = T & mongoose.Document;
export type TSGooseModel<T> = mongoose.Model<TSGooseDocument<T>> & T;
export type TSGooseDocumentQuery<T> = mongoose.DocumentQuery<T, TSGooseDocument<T>>;


export interface ITSGooseHookOptions {
  type: TSGooseHookType;
  name: string;
}

export enum TSGooseHookType {
  Pre,
  Post
}

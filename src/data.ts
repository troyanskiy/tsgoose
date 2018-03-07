import * as mongoose from 'mongoose';
import { ITSGooseHookLikeEntry, ITSGooseVirtualEntry } from './declarations';

export const schemas: any = {};
export const schemaOptions: {[name: string]: mongoose.SchemaOptions} = {};
export const methods: any = {};
export const statics: any = {};
export const queryHelpers: {[name: string]: ITSGooseHookLikeEntry[]} = {};
export const virtuals: {[name: string]: ITSGooseVirtualEntry[]} = {};
export const preHooks: {[name: string]: ITSGooseHookLikeEntry[]} = {};
export const postHooks: {[name: string]: ITSGooseHookLikeEntry[]} = {};
export const schemasInstances: {[name: string]: mongoose.Schema} = {};
export const models: {[name: string]: mongoose.Model<any>} = {};

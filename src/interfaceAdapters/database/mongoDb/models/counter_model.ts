import {Document, model, models, Types} from 'mongoose';
import { CounterSchema } from '../schemas/counter_schema';
import { CounterMongoBase } from '../types/counter_mongo_base';

export interface ICounterModel extends CounterMongoBase, Document {
    _id: Types.ObjectId
}

export const CounterModel = models.Counter || model<ICounterModel>('Counter',CounterSchema)
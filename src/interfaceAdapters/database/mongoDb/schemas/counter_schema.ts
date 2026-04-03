import {Schema} from 'mongoose';
import { ICounterModel } from '../models/counter_model';


export const CounterSchema = new Schema<ICounterModel> (
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: Number,
            default: 0,
        }
    },{
        timestamps: true
    }
)
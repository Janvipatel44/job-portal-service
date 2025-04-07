import { Schema, Document} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const JobSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  jobType: { type: String, required: true },
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  benefits: [String],
  extras: Schema.Types.Mixed,
  createdAt: { type: Date, default: () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0); 
    return date; 
  } },
});

export interface Job extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  salary: {
    min: number;
    max: number;
  };
  benefits: string[];
  extras: any;
  createdAt: Date;
}

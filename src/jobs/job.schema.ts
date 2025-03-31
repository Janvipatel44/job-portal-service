import { Schema, Document } from 'mongoose';

export const JobSchema = new Schema({
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
  createdAt: { type: Date, default: Date.now },
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

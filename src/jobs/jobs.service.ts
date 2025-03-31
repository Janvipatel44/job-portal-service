import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './job.schema';

@Injectable()
export class JobsService {
  constructor(@InjectModel('Job') private jobModel: Model<Job>) {}

  async create(jobData: Job): Promise<Job> {
    const job = new this.jobModel(jobData);
    return job.save(); 
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel.find().exec(); 
  }

  async search(query: any): Promise<Job[]> {
    return this.jobModel.find(query).exec(); 
  }
}

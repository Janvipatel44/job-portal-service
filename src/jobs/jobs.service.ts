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

  async findById(id: string): Promise<Job | null> {
    return this.jobModel.findById(id).exec();
  }

  async update(id: string, jobData: Partial<Job>): Promise<Job | null> {
    return this.jobModel.findByIdAndUpdate(id, jobData, { new: true }).exec();
  }

  async delete(id: string): Promise<Job | null> {
    return this.jobModel.findByIdAndDelete(id).exec();
  }

  async search(query: any): Promise<Job[]> {
    const filter: any = {};
    if (query.title) filter.title = new RegExp(query.title, 'i');
    if (query.location) filter.location = new RegExp(query.location, 'i');
    if (query.minSalary) filter['salary.min'] = { $gte: parseInt(query.minSalary) };
    if (query.maxSalary) filter['salary.max'] = { $lte: parseInt(query.maxSalary) };

    const jobs = await this.jobModel.find(filter).exec();

    return jobs.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      if ((b.salary?.max || 0) > (a.salary?.max || 0)) return 1;
      return -1;
    });
  }
}
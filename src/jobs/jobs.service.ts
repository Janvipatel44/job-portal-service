import { Injectable, OnModuleDestroy, BeforeApplicationShutdown, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './job.schema';
import { Throttle } from '@nestjs/throttler';
import { JobServiceInterface } from './interfaces/jobService.interface';

@Injectable()
export class JobsService implements JobServiceInterface {
  private readonly logger = new Logger(JobsService.name);

  constructor(@InjectModel('Job') private readonly jobModel: Model<Job>) {}

  async create(jobData: Job): Promise<Job> {
    try {
      const job = new this.jobModel(jobData);
      return await job.save();
    } catch (error) {
      this.logger.error('Error creating job:', error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 10): Promise<Job[]> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be greater than 0');
      }

      const skip = (page - 1) * limit;
      return await this.jobModel.find().skip(skip).limit(limit).exec();
    } catch (error) {
      this.logger.error('Error finding jobs:', error);
      throw error;
    }
  }

  async update(id: string, jobData: Partial<Job>): Promise<Job | null> {
    try {
      return await this.jobModel.findByIdAndUpdate(id, jobData, { new: true }).exec();
    } catch (error) {
      this.logger.error(`Error updating job with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<Job | null> {
    try {
      return await this.jobModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error(`Error deleting job with id ${id}:`, error);
      throw error;
    }
  }

  async deleteAll(): Promise<{ deletedCount?: number }> {
    try {
      const result = await this.jobModel.deleteMany({});
      return { deletedCount: result.deletedCount };
    } catch (error) {
      this.logger.error('Error deleting all jobs:', error);
      throw error;
    }
  }

  private getSortingRules(): Record<string, number> {
    return {
      isFullTime: -1, // Full-time jobs rank above part-time
      isRecent: -1, // Recent jobs rank higher
      'salary.max': -1, // Higher salary ranks higher
      companyJobCount: -1, // Companies with more jobs rank higher
    };
  }

  @Throttle({ default: { limit: 5, ttl: 60 } })
  async search(query: any): Promise<Job[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const updatedQuery: any = {};

      if (query.salary) {
        const salaryValue = Number(query.salary);
        if (!isNaN(salaryValue)) {
          updatedQuery['salary.min'] = { $lte: salaryValue };
          updatedQuery['salary.max'] = { $gte: salaryValue };
        }
      }
      const sortingRules = this.getSortingRules() as Record<string, 1 | -1>;

      return await this.jobModel.aggregate([
        { $match: updatedQuery },
        {
          $lookup: {
            from: 'companies',
            localField: 'company',
            foreignField: '_id',
            as: 'companyDetails',
          },
        },
        {
          $addFields: {
            companyJobCount: { $size: '$companyDetails' },
            isRecent: { $cond: { if: { $gte: ['$createdAt', sevenDaysAgo] }, then: 1, else: 0 } },
            isFullTime: { $cond: { if: { $eq: ['$jobType', 'full-time'] }, then: 1, else: 0 } },
          },
        },
        { $sort: sortingRules },
        { $project: { companyDetails: 0 } },
      ]).exec();
    } catch (error) {
      this.logger.error('Error searching jobs:', error);
      throw error;
    }
  }

  async beforeApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`Server is shutting down due to ${signal}, deleting all jobs...`);
    try {
      const result = await this.jobModel.deleteMany({});
      this.logger.log(`All jobs deleted. Total: ${result.deletedCount}`);
    } catch (error) {
      this.logger.error('Error during shutdown cleanup:', error);
    }
  }

  async onModuleDestroy(signal?: string): Promise<void> {
    await this.beforeApplicationShutdown(signal);
  }
}

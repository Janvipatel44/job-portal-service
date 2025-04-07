import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from '../../src/jobs/jobs.service';
import { JobsModule } from '../../src/jobs/jobs.module';
import { Job, JobSchema } from '../../src/jobs/job.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('Job Schema', () => {
  let jobModel: mongoose.Model<Job>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/jobportal_test'), // Ensure test DB
        MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
      ],
      providers: [JobsService],
    }).compile();

    jobModel = module.get<mongoose.Model<Job>>(getModelToken('Job'));
});

  it('should create a job with valid fields', async () => {
    const jobData = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'New York, NY',
      description: 'A job for a software engineer.',
      jobType: 'Full-Time',
      salary: { min: 80000, max: 120000 },
      benefits: ['Health Insurance', 'Paid Time Off'],
      extras: { remoteWork: true },
    };

    const job = await jobModel.create(jobData);

    expect(job._id).toBeDefined();
    expect(job.title).toBe(jobData.title);
    expect(job.company).toBe(jobData.company);
    expect(job.location).toBe(jobData.location);
    expect(job.jobType).toBe(jobData.jobType);
    expect(job.salary.min).toBe(jobData.salary.min);
    expect(job.salary.max).toBe(jobData.salary.max);
    expect(job.benefits).toEqual(jobData.benefits);
    expect(job.extras).toEqual(jobData.extras);
    expect(job.createdAt).toBeDefined();
  });

  it('should throw an error if required fields are missing', async () => {
    const jobData = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'New York, NY',
      jobType: 'Full-Time',
      salary: { min: 80000, max: 120000 },
      benefits: ['Health Insurance', 'Paid Time Off'],
      extras: { remoteWork: true },
    };

    await expect(jobModel.create(jobData)).rejects.toThrow();
  });

  it('should set _id as a UUID by default', async () => {
    const jobData = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'New York, NY',
      description: 'A job for a software engineer.',
      jobType: 'Full-Time',
      salary: { min: 80000, max: 120000 },
      benefits: ['Health Insurance', 'Paid Time Off'],
      extras: { remoteWork: true },
    };

    const job = await jobModel.create(jobData);

    expect(job._id).toMatch(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    );
  });

  it('should have a createdAt date in the correct format', async () => {
    const jobData = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'New York, NY',
      description: 'A job for a software engineer.',
      jobType: 'Full-Time',
      salary: { min: 80000, max: 120000 },
      benefits: ['Health Insurance', 'Paid Time Off'],
      extras: { remoteWork: true },
    };

    const job = await jobModel.create(jobData);

    const createdAt = job.createdAt;
    expect(createdAt).toBeInstanceOf(Date);
  });

  it('should set default value for createdAt', async () => {
    const jobData = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'New York, NY',
      description: 'A job for a software engineer.',
      jobType: 'Full-Time',
      salary: { min: 80000, max: 120000 },
      benefits: ['Health Insurance', 'Paid Time Off'],
      extras: { remoteWork: true },
    };

    const job = await jobModel.create(jobData);

    const createdAt = job.createdAt;
    expect(createdAt).toBeDefined();
  });

});

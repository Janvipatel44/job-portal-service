import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from '../../src/jobs/jobs.service';
import { getModelToken } from '@nestjs/mongoose';
import { Job } from '../../src/jobs/job.schema';
import { Model } from 'mongoose';

const mockJobModel = {
    create: jest.fn().mockImplementation((jobData) => Promise.resolve({ ...jobData, _id: 'uuid123' })),
    find: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([{ _id: 'uuid123', title: 'Software Engineer' }]),
    findByIdAndUpdate: jest.fn().mockImplementation((id, jobData, options) => ({
      exec: jest.fn().mockResolvedValue({ _id: id, ...jobData }),
    })),
    findByIdAndDelete: jest.fn().mockImplementation((id) => ({
      exec: jest.fn().mockResolvedValue({ _id: id, title: 'Deleted Job' }),
    })),
    deleteMany: jest.fn().mockResolvedValue({
      deletedCount: 5,
      exec: jest.fn().mockResolvedValue({ deletedCount: 5 }),
    }),
    // Simulate the constructor call for Mongoose model
    constructor: jest.fn().mockImplementation(() => mockJobModel),
  };  
  
  describe('JobsService', () => {
    let service: JobsService;
    let model: Model<Job>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          JobsService,
          { provide: getModelToken('Job'), useValue: mockJobModel },
        ],
      }).compile();
  
      service = module.get<JobsService>(JobsService);
      model = module.get<Model<Job>>(getModelToken('Job'));
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    it('should return all jobs', async () => {
      const result = await service.findAll(1, 10);
      expect(result.length).toBeGreaterThan(0);
    });
  
    it('should update a job', async () => {
      const updatedJob = await service.update('uuid123', { title: 'Updated Job' });
      expect(updatedJob).toHaveProperty('_id', 'uuid123');
      if (updatedJob) {
        expect(updatedJob.title).toBe('Updated Job');
      }
    });
  
    it('should delete a job', async () => {
      const deletedJob = await service.delete('uuid123');
      expect(deletedJob).toHaveProperty('_id', 'uuid123');
    });
  
    it('should delete all jobs', async () => {
      const result = await service.deleteAll();
      expect(result.deletedCount).toBe(5);
    });
  });
  
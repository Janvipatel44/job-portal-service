import { Job } from '../job.schema';

export interface JobServiceInterface {
    search(query: any): Promise<Job[]>;
    create(jobData: Partial<Job>): Promise<Job>;
    findAll(page: number, limit: number): Promise<Job[]>;
    update(id: string, jobData: Partial<Job>): Promise<Job | null>;
    delete(id: string): Promise<Job | null>;
    deleteAll(): Promise<any>;
}
  
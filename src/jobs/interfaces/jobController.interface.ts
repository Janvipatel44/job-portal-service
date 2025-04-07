import { Job } from '../job.schema';

export interface JobControllerInterface {
    create(jobData: Job): Promise<Job>;
    findAll(page: number, limit: number): Promise<Job[]>;
    search(query: any): Promise<Job[]>;
    update(id: string, jobData: Partial<Job>): Promise<Job | null>;
    delete(id: string): Promise<Job | null>;
    deleteAll(): Promise<any>;
}

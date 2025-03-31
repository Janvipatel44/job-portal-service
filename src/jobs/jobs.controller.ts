import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './job.schema';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() jobData: Job): Promise<Job> {
    return this.jobsService.create(jobData);
  }

  @Get()
  findAll(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

  @Get('search')
  search(@Query() query: any): Promise<Job[]> {
    return this.jobsService.search(query);
  }
}

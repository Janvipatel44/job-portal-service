import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
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

  @Get(':id')
  findById(@Param('id') id: string): Promise<Job | null> {
    return this.jobsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() jobData: Partial<Job>): Promise<Job | null> {
    return this.jobsService.update(id, jobData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Job | null> {
    return this.jobsService.delete(id);
  }

  @Get('search')
  search(@Query() query: any): Promise<Job[]> {
    return this.jobsService.search(query);
  }
}

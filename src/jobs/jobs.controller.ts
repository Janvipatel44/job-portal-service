import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './job.schema';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler'; 
import { JobControllerInterface } from './interfaces/jobController.interface';

@Controller('jobs')
export class JobsController implements JobControllerInterface {
  constructor(private readonly jobsService: JobsService) {}

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post()
  create(@Body() jobData: Job): Promise<Job> {
    return this.jobsService.create(jobData);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Job[]> {
    return this.jobsService.findAll(page, limit);
  }

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Get('search')
  search(@Query() query: any): Promise<Job[]> {
    console.log('Search');
    return this.jobsService.search(query);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() jobData: Partial<Job>): Promise<Job | null> {
    return this.jobsService.update(id, jobData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Job | null> {
    return this.jobsService.delete(id);
  }

  @Delete('all')
  deleteAll(): Promise<any> {
    return this.jobsService.deleteAll();
  }
}

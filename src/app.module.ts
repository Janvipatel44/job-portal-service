import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,   // Time window for throttling
          limit: 5,  // Max requests allowed in that window
        },
      ],
    }),
    JobsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/jobportal'),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,  // Apply ThrottlerGuard globally
    },
  ],
})
export class AppModule {}

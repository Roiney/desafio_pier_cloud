import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalHttpModule } from './global/http/global-http.module';
import { FetchApiModule } from './modules/fetch-api/fetch-api.module';
import { HealthModule } from './modules/health/health.module';
import { JobModule } from './modules/job/job.module';
import { MessagingPublisherModule } from './modules/messaging-publisher/messaging-publisher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GlobalHttpModule,
    HealthModule,
    JobModule,
    FetchApiModule,
    MessagingPublisherModule,
  ],
})
export class AppModule {}

import { Global, Module } from '@nestjs/common';
import { FetchApiService } from './fetch-api.service';
@Global()
@Module({
  exports: [FetchApiService],
  providers: [FetchApiService],
})
export class FetchApiModule {}

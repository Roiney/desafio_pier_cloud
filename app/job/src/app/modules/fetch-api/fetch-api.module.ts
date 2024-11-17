import { Global, Module } from '@nestjs/common';
import { FetchApiService } from './fetch-api.service';

@Global()
@Module({
  providers: [FetchApiService],
  exports: [FetchApiService],
})
export class FetchApiModule {}

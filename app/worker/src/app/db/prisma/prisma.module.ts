import { Global, Module } from '@nestjs/common';
import { dbPrismaService } from './dbPrismaService.service';

@Global()
@Module({
  providers: [dbPrismaService],
  exports: [dbPrismaService],
})
export class PrismaModule {}

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from 'src/app/db/prisma/prisma.module';
import { HealthController } from './health.controller';
import { PrismaOrmHealthIndicator } from './prisma.health.service';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaOrmHealthIndicator],
})
export class HealthModule {}

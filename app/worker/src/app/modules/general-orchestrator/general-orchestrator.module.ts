import { Module } from '@nestjs/common';
import { GeneralOrchestratorService } from './general-orchestrator.service';

@Module({
  providers: [GeneralOrchestratorService],
})
export class GeneralOrchestratorModule {}

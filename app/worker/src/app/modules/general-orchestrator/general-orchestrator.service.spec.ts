import { Test, TestingModule } from '@nestjs/testing';
import { GeneralOrchestratorService } from './general-orchestrator.service';

describe('GeneralOrchestratorService', () => {
  let service: GeneralOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralOrchestratorService],
    }).compile();

    service = module.get<GeneralOrchestratorService>(
      GeneralOrchestratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

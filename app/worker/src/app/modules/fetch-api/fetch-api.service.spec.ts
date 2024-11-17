import { Test, TestingModule } from '@nestjs/testing';
import { FetchApiService } from './fetch-api.service';

describe('FetchApiService', () => {
  let service: FetchApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchApiService],
    }).compile();

    service = module.get<FetchApiService>(FetchApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

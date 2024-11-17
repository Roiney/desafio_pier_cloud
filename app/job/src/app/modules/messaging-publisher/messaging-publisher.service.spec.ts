import { Test, TestingModule } from '@nestjs/testing';
import { MessagingPublisherService } from './messaging-publisher.service';

describe('MessagingPublisherService', () => {
  let service: MessagingPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagingPublisherService],
    }).compile();

    service = module.get<MessagingPublisherService>(MessagingPublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

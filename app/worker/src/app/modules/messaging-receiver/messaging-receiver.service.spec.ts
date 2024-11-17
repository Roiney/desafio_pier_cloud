import { Test, TestingModule } from '@nestjs/testing';
import { MessagingReceiverService } from './messaging-receiver.service';

describe('MessagingReceiverService', () => {
  let service: MessagingReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagingReceiverService],
    }).compile();

    service = module.get<MessagingReceiverService>(MessagingReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

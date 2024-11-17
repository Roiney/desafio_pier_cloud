import { Test, TestingModule } from '@nestjs/testing';
import { MessagingReceiverController } from './messaging-receiver.controller';
import { MessagingReceiverService } from './messaging-receiver.service';

describe('MessagingReceiverController', () => {
  let controller: MessagingReceiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagingReceiverController],
      providers: [MessagingReceiverService],
    }).compile();

    controller = module.get<MessagingReceiverController>(MessagingReceiverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

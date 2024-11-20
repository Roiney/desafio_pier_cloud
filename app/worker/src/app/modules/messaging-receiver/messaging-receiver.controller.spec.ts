import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagingReceiverController } from './messaging-receiver.controller';
import { MessagingReceiverService } from './messaging-receiver.service';

describe('MessagingReceiverController', () => {
  let controller: MessagingReceiverController;
  let service: MessagingReceiverService;

  const mockService = {
    registerSeller: jest.fn(),
  };

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagingReceiverController],
      providers: [
        {
          provide: MessagingReceiverService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MessagingReceiverController>(
      MessagingReceiverController,
    );
    service = module.get<MessagingReceiverService>(MessagingReceiverService);

    // Mock do Logger
    jest.spyOn(Logger, 'log').mockImplementation(loggerMock.log);
    jest.spyOn(Logger, 'error').mockImplementation(loggerMock.error);
    jest.spyOn(Logger, 'warn').mockImplementation(loggerMock.warn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});

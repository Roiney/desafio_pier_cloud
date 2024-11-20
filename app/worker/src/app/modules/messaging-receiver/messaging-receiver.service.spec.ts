import { Test, TestingModule } from '@nestjs/testing';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { SellerService } from '../seller/seller.service';
import { MessagingReceiverService } from './messaging-receiver.service';

describe('MessagingReceiverService', () => {
  let service: MessagingReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagingReceiverService, SellerService, dbPrismaService],
    }).compile();

    service = module.get<MessagingReceiverService>(MessagingReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

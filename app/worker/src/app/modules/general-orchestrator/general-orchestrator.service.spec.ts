import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { ClientsService } from '../clients/clients.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { ProductsService } from '../products/products.service';
import { SalesService } from '../sales/sales.service';
import { SellerService } from '../seller/seller.service';
import { GeneralOrchestratorService } from './general-orchestrator.service';

describe('GeneralOrchestratorService', () => {
  let service: GeneralOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneralOrchestratorService,
        ClientsService,
        SellerService,
        ProductsService,
        SalesService,
        FetchApiService,
        dbPrismaService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GeneralOrchestratorService>(
      GeneralOrchestratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

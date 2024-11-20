import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from '../sales/sales.service';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const mockSalesService = {
      // Adicione mocks necessários para os métodos utilizados pelo ReportsService
      findSales: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

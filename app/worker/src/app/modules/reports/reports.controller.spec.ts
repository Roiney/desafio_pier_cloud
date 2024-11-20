import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from '../sales/sales.service'; // Importe o SalesService corretamente
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  beforeEach(async () => {
    const mockSalesService = {
      // Adicione mocks necessários para os métodos utilizados pelo ReportsService
      findSales: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        ReportsService,
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

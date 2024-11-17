import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;
  let memoryHealthIndicator: MemoryHealthIndicator;
  let diskHealthIndicator: DiskHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(async (checks: any[]) => {
              // Execute cada função de verificação para simular o comportamento real
              for (const check of checks) {
                await check();
              }
              return { status: 'ok', info: {}, error: {}, details: {} };
            }),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(),
            checkRSS: jest.fn(),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: { checkStorage: jest.fn() },
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    memoryHealthIndicator = module.get<MemoryHealthIndicator>(
      MemoryHealthIndicator,
    );
    diskHealthIndicator = module.get<DiskHealthIndicator>(DiskHealthIndicator);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should perform health checks', async () => {
    const mockHealthCheckResult = {
      status: 'ok',
      info: {},
      error: {},
      details: {},
    };
    (healthCheckService.check as jest.Mock).mockResolvedValue(
      mockHealthCheckResult,
    );

    const result = await healthController.check();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(healthCheckService.check).toHaveBeenCalledWith([
      expect.any(Function), // Memory checkHeap function
      expect.any(Function), // Memory checkRSS function
      expect.any(Function), // Disk checkStorage function
    ]);
    expect(result).toBe(mockHealthCheckResult);
  });

  it('should call memory checkHeap with the correct parameters', async () => {
    const checkHeapSpy = jest.spyOn(memoryHealthIndicator, 'checkHeap');
    await healthController.check();
    expect(checkHeapSpy).toHaveBeenCalledWith('memory_heap', 150 * 1024 * 1024);
  });

  it('should call memory checkRSS with the correct parameters', async () => {
    const checkRSSSpy = jest.spyOn(memoryHealthIndicator, 'checkRSS');
    await healthController.check();
    expect(checkRSSSpy).toHaveBeenCalledWith('memory_rss', 150 * 1024 * 1024);
  });

  it('should call disk checkStorage with the correct parameters', async () => {
    const checkStorageSpy = jest.spyOn(diskHealthIndicator, 'checkStorage');
    await healthController.check();
    expect(checkStorageSpy).toHaveBeenCalledWith('storage', {
      thresholdPercent: 0.8,
      path: '/',
    });
  });
});

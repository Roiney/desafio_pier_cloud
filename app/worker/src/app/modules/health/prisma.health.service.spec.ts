import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { PrismaOrmHealthIndicator } from './prisma.health.service';

describe('PrismaOrmHealthIndicator', () => {
  let healthIndicator: PrismaOrmHealthIndicator;
  let prismaService: dbPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaOrmHealthIndicator,
        {
          provide: dbPrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    healthIndicator = module.get<PrismaOrmHealthIndicator>(
      PrismaOrmHealthIndicator,
    );
    prismaService = module.get<dbPrismaService>(dbPrismaService);
  });

  it('should return a healthy status when the database is accessible', async () => {
    // Simula uma resposta bem-sucedida para a consulta
    (prismaService.$queryRaw as jest.Mock).mockResolvedValue(1);

    const result = await healthIndicator.pingCheck('database');

    expect(result).toEqual({ database: { status: 'up' } });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaService.$queryRaw).toHaveBeenCalledWith`SELECT 1`;
  });

  it('should throw ServiceUnavailableException when an error occurs', async () => {
    // Simula um erro ao executar a consulta
    (prismaService.$queryRaw as jest.Mock).mockRejectedValue(
      new Error('Connection failed'),
    );

    await expect(healthIndicator.pingCheck('database')).rejects.toThrow(
      ServiceUnavailableException,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaService.$queryRaw).toHaveBeenCalledWith`SELECT 1`;
  });

  it('should throw ServiceUnavailableException with a custom message', async () => {
    const customError = { message: 'Custom error' };
    (prismaService.$queryRaw as jest.Mock).mockRejectedValue(customError);

    await expect(healthIndicator.pingCheck('database')).rejects.toThrow(
      new ServiceUnavailableException(
        'Get in touch with the infrastructure: An unknown error occurred',
      ),
    );
  });
});

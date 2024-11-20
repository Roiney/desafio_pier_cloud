import { Test, TestingModule } from '@nestjs/testing';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { SellerService } from './seller.service';

describe('SellerService', () => {
  let service: SellerService;
  let prismaService: dbPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerService, dbPrismaService],
    }).compile();

    service = module.get<SellerService>(SellerService);
    prismaService = module.get<dbPrismaService>(dbPrismaService);

    // Use um banco de dados separado para testes
    await prismaService.$connect();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    await prismaService.wlPierCloudSale.deleteMany();
    await prismaService.wlPierCloudProduct.deleteMany();
    await prismaService.wlPierCloudSeller.deleteMany();
    await prismaService.wlPierCloudClient.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('deve encontrar um vendedor pelo ID', async () => {
      const seller = await service.registerSeller(
        1000,
        'Test Seller',
        '123456789',
      );
      const foundSeller = await service.findOne(1000);
      expect(foundSeller).toEqual(seller);
    });

    it('deve retornar null se o vendedor não existir', async () => {
      const foundSeller = await service.findOne(999);
      expect(foundSeller).toBeNull();
    });
  });

  describe('findMany', () => {
    it('deve retornar uma lista de vendedores', async () => {
      await service.registerSeller(1, 'Seller 1', '123456789');
      await service.registerSeller(2, 'Seller 2', '987654321');

      const sellers = await service.findMany();
      expect(sellers.length).toBe(2);
    });

    it('deve retornar uma lista vazia se não houver vendedores', async () => {
      const sellers = await service.findMany();
      expect(sellers.length).toBe(0);
    });
  });

  describe('registerSeller', () => {
    it('deve registrar um novo vendedor', async () => {
      const seller = await service.registerSeller(1, 'New Seller', '555555555');
      expect(seller).toHaveProperty('id', 1);
      expect(seller).toHaveProperty('name', 'New Seller');
      expect(seller).toHaveProperty('phone', '555555555');
    });

    it('deve lançar um erro ao tentar registrar um vendedor com ID duplicado', async () => {
      await service.registerSeller(1, 'Duplicate Seller', '111111111');

      await expect(
        service.registerSeller(1, 'Another Seller', '222222222'),
      ).rejects.toThrowError('Erro ao registrar vendedor');
    });
  });
});

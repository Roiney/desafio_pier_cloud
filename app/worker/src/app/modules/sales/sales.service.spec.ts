import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { SalesService } from './sales.service';

describe('SalesService', () => {
  let service: SalesService;
  let prismaService: dbPrismaService;
  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        FetchApiService,
        dbPrismaService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    prismaService = module.get<dbPrismaService>(dbPrismaService);
    // Conecta ao banco de dados de testes
    await prismaService.$connect();
  });
  afterAll(async () => {
    // Desconecta do banco de dados
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    await prismaService.wlPierCloudProduct.deleteMany();
    await prismaService.wlPierCloudSeller.deleteMany();
    await prismaService.wlPierCloudSale.deleteMany();
    await prismaService.wlPierCloudClient.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findOne', () => {
    it('deve retornar uma venda pelo ID', async () => {
      // Cria registros relacionados
      const client = await prismaService.wlPierCloudClient.create({
        data: {
          id: 1,
          nome: 'Test Client',
          telefone: '123456789',
          email: 'test@client.com',
        },
      });

      const seller = await prismaService.wlPierCloudSeller.create({
        data: { id: 1, name: 'Vendedor Teste', phone: '987654321' },
      });

      const product = await prismaService.wlPierCloudProduct.create({
        data: {
          id: 1,
          nome: 'Produto Teste',
          tipo: 'ELETRONICO',
          preco: 100.5,
          sku: 'TESTE123',
          vendedor_id: seller.id,
        },
      });

      const sale = await prismaService.wlPierCloudSale.create({
        data: {
          id: 1,
          cliente_id: client.id,
          vendedor_id: seller.id,
          produto_id: product.id,
        },
      });

      // Busca a venda pelo ID com relacionamentos
      const foundSale = await prismaService.wlPierCloudSale.findUnique({
        where: { id: sale.id },
        include: {
          cliente: true,
          vendedor: true,
          produto: true,
        },
      });

      // Verifica se os dados estão corretos
      expect(foundSale).toEqual(
        expect.objectContaining({
          id: sale.id,
          cliente_id: client.id,
          vendedor_id: seller.id,
          produto_id: product.id,
          cliente: expect.objectContaining({
            id: client.id,
            nome: client.nome,
            telefone: client.telefone,
            email: client.email,
          }),
          vendedor: expect.objectContaining({
            id: seller.id,
            name: seller.name,
            phone: seller.phone,
          }),
          produto: expect.objectContaining({
            id: product.id,
            nome: product.nome,
            tipo: product.tipo,
            preco: product.preco,
            sku: product.sku,
          }),
        }),
      );
    });

    it('deve retornar null se a venda não existir', async () => {
      const foundSale = await service.findOne(999);
      expect(foundSale).toBeNull();
    });
  });

  describe('registerSale', () => {
    it('deve registrar uma nova venda', async () => {
      // Cria registros relacionados
      const client = await prismaService.wlPierCloudClient.create({
        data: {
          id: 1,
          nome: 'Test Client',
          telefone: '123456789',
          email: 'test@client.com',
        },
      });

      const seller = await prismaService.wlPierCloudSeller.create({
        data: { id: 2, name: 'Vendedor Teste 2', phone: '444555666' },
      });

      const product = await prismaService.wlPierCloudProduct.create({
        data: {
          id: 2,
          nome: 'Produto Teste 2',
          tipo: 'LIVRO',
          preco: 50.0,
          sku: 'LIVRO123',
          vendedor_id: seller.id,
        },
      });

      const sale = {
        id: '2', // Corrigido para ser número
        cliente_id: client.id.toString(),
        vendedor_id: seller.id.toString(),
        produto_id: product.id.toString(),
      };

      // Registra a venda
      const registeredSale = await service.registerSale(sale);

      // Verifica se os dados estão corretos
      expect(registeredSale).toHaveProperty('id', Number(sale.id));
      expect(registeredSale).toHaveProperty(
        'cliente_id',
        Number(sale.cliente_id),
      );
      expect(registeredSale).toHaveProperty(
        'vendedor_id',
        Number(sale.vendedor_id),
      );
      expect(registeredSale).toHaveProperty(
        'produto_id',
        Number(sale.produto_id),
      );
    });

    it('deve lançar um erro ao tentar registrar uma venda com dados inválidos', async () => {
      const invalidSale = {
        id: null,
        cliente_id: null,
        vendedor_id: null,
        produto_id: null,
      };

      await expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        service.registerSale(invalidSale as any),
      ).rejects.toThrowError('Dados inválidos para a venda');
    });
  });

  describe('fetchSalesData', () => {
    it('deve buscar dados de vendas com relacionamentos', async () => {
      // Cria registros relacionados
      const client = await prismaService.wlPierCloudClient.create({
        data: {
          id: 1,
          nome: 'Test Client',
          telefone: '123456789',
          email: 'test@client.com',
        },
      });

      const seller = await prismaService.wlPierCloudSeller.create({
        data: { id: 3, name: 'Vendedor Teste 3', phone: '000111222' },
      });

      const product = await prismaService.wlPierCloudProduct.create({
        data: {
          id: 3,
          nome: 'Produto Teste 3',
          tipo: 'ELETRONICO',
          preco: 200.0,
          sku: 'ELE123',
          vendedor_id: seller.id,
        },
      });

      await prismaService.wlPierCloudSale.create({
        data: {
          id: 3,
          cliente_id: client.id,
          vendedor_id: seller.id,
          produto_id: product.id,
        },
      });

      // Busca dados de vendas com relacionamentos
      const salesData = await service.fetchSalesData();

      expect(salesData).toHaveLength(1);
      expect(salesData[0]).toHaveProperty('cliente');
      expect(salesData[0]).toHaveProperty('produto');
      expect(salesData[0]).toHaveProperty('vendedor');
    });
  });
});

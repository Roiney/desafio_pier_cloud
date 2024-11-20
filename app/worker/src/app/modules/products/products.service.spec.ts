import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
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
        ProductsService,
        FetchApiService,
        dbPrismaService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<dbPrismaService>(dbPrismaService);
    // Conecta ao banco de dados de testes
    await prismaService.$connect();
  });
  afterAll(async () => {
    // Desconecta do banco de dados
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    // Limpa a tabela wlPierCloudProduct após cada teste
    await prismaService.wlPierCloudProduct.deleteMany();
    await prismaService.wlPierCloudSeller.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findProductById', () => {
    it('deve retornar um produto pelo ID', async () => {
      // Insere um vendedor no banco
      const seller = await prismaService.wlPierCloudSeller.create({
        data: {
          id: 1,
          name: 'Vendedor Teste',
          phone: '123456789',
        },
      });

      // Insere um produto no banco
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

      // Busca o produto pelo ID
      const foundProduct = await service.findProductById(product.id);

      // Verifica se o produto encontrado é igual ao registrado
      expect(foundProduct).toEqual(product);
    });

    it('deve retornar null se o produto não existir', async () => {
      // Tenta buscar um produto com ID inexistente
      const foundProduct = await service.findProductById(999);

      // Verifica se o retorno é null
      expect(foundProduct).toBeNull();
    });
  });
  describe('createProduct', () => {
    beforeEach(async () => {
      // Insere vendedores necessários para os testes
      await prismaService.wlPierCloudSeller.createMany({
        data: [
          { id: 1, name: 'Vendedor 1', phone: '123456789' },
          { id: 2, name: 'Vendedor 2', phone: '987654321' },
        ],
      });
    });

    it('deve registrar um novo produto', async () => {
      const product = {
        id: '2',
        nome: 'Novo Produto',
        tipo: 'LIVRO',
        preco: '50',
        sku: 'NOVO123',
        vendedor_id: '1', // Associado ao vendedor existente
      };

      // Registra o produto
      const createdProduct = await service.createProduct(product);

      // Verifica se os dados estão corretos
      expect(createdProduct).toHaveProperty('id', Number(product.id));
      expect(createdProduct).toHaveProperty('nome', product.nome);
      expect(createdProduct).toHaveProperty('tipo', product.tipo);
      expect(createdProduct).toHaveProperty('sku', product.sku);
      expect(createdProduct).toHaveProperty(
        'vendedor_id',
        Number(product.vendedor_id),
      );
    });

    it('deve lançar um erro ao tentar registrar um produto com dados inválidos', async () => {
      const invalidProduct = {
        id: null,
        nome: '',
        tipo: '',
        preco: null,
        sku: '',
        vendedor_id: null, // Sem vendedor associado
      };

      // Verifica se um erro é lançado
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        service.createProduct(invalidProduct as any),
      ).rejects.toThrowError('Dados inválidos para o produto');
    });

    it('deve lançar um erro ao tentar registrar um produto com ID duplicado', async () => {
      const product = {
        id: '3',
        nome: 'Produto Duplicado',
        tipo: 'GADGET',
        preco: '150.0',
        sku: 'DUP123',
        vendedor_id: '2', // Associado ao vendedor existente
      };

      // Registra o primeiro produto
      await service.createProduct(product);

      // Tenta registrar outro produto com o mesmo ID
      await expect(service.createProduct(product)).rejects.toThrowError();
    });
  });
});

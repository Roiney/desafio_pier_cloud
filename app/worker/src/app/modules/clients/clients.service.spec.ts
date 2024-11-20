import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  let service: ClientsService;
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
        ClientsService,
        FetchApiService,
        dbPrismaService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prismaService = module.get<dbPrismaService>(dbPrismaService);

    // Conecta ao banco de dados de testes
    await prismaService.$connect();
  });
  afterAll(async () => {
    // Desconecta do banco de dados
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
    it('deve retornar um cliente pelo ID', async () => {
      // Registra um cliente no banco
      const client = await prismaService.wlPierCloudClient.create({
        data: {
          id: 1,
          nome: 'Test Client',
          telefone: '123456789',
          email: 'test@client.com',
        },
      });

      // Busca o cliente pelo ID
      const foundClient = await service.findOne(client.id);

      // Verifica se o cliente encontrado é igual ao registrado
      expect(foundClient).toEqual(client);
    });

    it('deve retornar null se o cliente não existir', async () => {
      // Tenta buscar um cliente com ID inexistente
      const foundClient = await service.findOne(999);

      // Verifica se o retorno é null
      expect(foundClient).toBeNull();
    });
  });

  describe('registerClient', () => {
    it('deve registrar um novo cliente', async () => {
      // Registra um cliente
      const client = await service.registerClient({
        id: '1',
        nome: 'New Client',
        telefone: '987654321',
        email: 'new@client.com',
      });

      // Verifica se os dados estão corretos
      expect(client).toHaveProperty('id', 1);
      expect(client).toHaveProperty('nome', 'New Client');
      expect(client).toHaveProperty('telefone', '987654321');
      expect(client).toHaveProperty('email', 'new@client.com');
    });

    it('deve lançar um erro ao tentar registrar um cliente com dados inválidos', async () => {
      // Dados inválidos
      const invalidClient = {
        id: null,
        nome: '',
        telefone: '',
        email: '',
      };

      // Verifica se um erro é lançado
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        service.registerClient(invalidClient as any),
      ).rejects.toThrowError('Dados inválidos para o cliente');
    });

    it('deve lançar um erro ao tentar registrar um cliente com ID duplicado', async () => {
      // Registra o primeiro cliente
      await service.registerClient({
        id: '1',
        nome: 'Duplicate Client',
        telefone: '555555555',
        email: 'duplicate@client.com',
      });

      // Tenta registrar outro cliente com o mesmo ID
      await expect(
        service.registerClient({
          id: '1',
          nome: 'Another Client',
          telefone: '666666666',
          email: 'another@client.com',
        }),
      ).rejects.toThrowError();
    });
  });
});

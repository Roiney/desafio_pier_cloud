import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosHeaders } from 'axios';
import { of } from 'rxjs';
import { Client } from '../clients/interface/clients.interface';
import { Product } from '../products/interface/product.interface';
import { Sale } from '../sales/interface/sales.interface';
import { FetchApiService } from './fetch-api.service';

describe('FetchApiService', () => {
  let service: FetchApiService;
  let httpService: HttpService;

  const mockApiResponseProduct = [
    {
      nome: 'Recycled Steel Computer',
      tipo: 'Shoes',
      preco: '64.00',
      sku: '2188',
      vendedor_id: '1',
      id: '1',
    },
    {
      nome: 'Elegant Wooden Chips',
      tipo: 'Shirt',
      preco: '447.00',
      sku: '516',
      vendedor_id: '1',
      id: '2',
    },
  ];

  const expectedTransformedResponseProduct: Product[] = [
    {
      id: '1',
      nome: 'Recycled Steel Computer',
      tipo: 'Shoes',
      preco: '64.00',
      sku: '2188',
      vendedor_id: '1',
    },
    {
      id: '2',
      nome: 'Elegant Wooden Chips',
      tipo: 'Shirt',
      preco: '447.00',
      sku: '516',
      vendedor_id: '1',
    },
  ];

  const mockApiResponseClient = [
    {
      nome: 'Zachary Carroll',
      telefone: '604.851.6596',
      email: 'Elizabeth_DAmore85@gmail.com',
      id: '1',
    },
    {
      nome: 'Barbara Heathcote',
      telefone: '1-320-966-5078',
      email: 'Geoffrey_Pagac@hotmail.com',
      id: '2',
    },
  ];

  const expectedTransformedResponseClient: Client[] = [
    {
      id: '1',
      nome: 'Zachary Carroll',
      telefone: '604.851.6596',
      email: 'Elizabeth_DAmore85@gmail.com',
    },
    {
      id: '2',
      nome: 'Barbara Heathcote',
      telefone: '1-320-966-5078',
      email: 'Geoffrey_Pagac@hotmail.com',
    },
  ];

  const mockApiResponseSales = [
    {
      vendedor_id: '1',
      produto_id: '1',
      cliente_id: '1',
      id: '1',
    },
    {
      vendedor_id: '1',
      produto_id: '2',
      cliente_id: '1',
      id: '2',
    },
  ];

  const expectedTransformedResponseSales: Sale[] = [
    {
      vendedor_id: '1',
      produto_id: '1',
      cliente_id: '1',
      id: '1',
    },
    {
      vendedor_id: '1',
      produto_id: '2',
      cliente_id: '1',
      id: '2',
    },
  ];

  const mockApiResponse = [
    { id: '1', name: 'Test Item 1' },
    { id: '2', name: 'Test Item 2' },
  ];

  const expectedTransformedResponse = [
    { id: '1', name: 'Test Item 1' },
    { id: '2', name: 'Test Item 2' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchApiService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FetchApiService>(FetchApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('fetchProducts', () => {
    it('should fetch and transform products correctly', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        expect(url).toBe(service.apiUrlProducts);
        return of({
          data: mockApiResponseProduct,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url: '',
            method: 'GET',
            headers: new AxiosHeaders(),
          },
        });
      });

      const products = await service.fetchProducts();

      expect(products).toEqual(expectedTransformedResponseProduct);
    });

    it('should throw an error if the API response is not an array', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: {},
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(), // Usa a classe AxiosHeaders
          config: {
            url: '',
            method: 'GET',
            headers: new AxiosHeaders(), // Usa a classe AxiosHeaders
          },
        }),
      );

      await expect(service.fetchProducts()).rejects.toThrow(
        'Dados não estão no formato esperado.',
      );
    });

    it('should throw an error if the API call fails', async () => {
      const mockError = new Error('API Error');
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw mockError;
      });

      await expect(service.fetchProducts()).rejects.toThrow(
        'Erro ao consumir a API',
      );
    });
  });

  describe('fetchClients', () => {
    it('should fetch and transform clients correctly', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        // Valida diretamente a URL chamada no mock
        expect(url).toBe(service.apiUrlClients);

        return of({
          data: mockApiResponseClient,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url,
            method: 'GET',
            headers: new AxiosHeaders(),
          },
        });
      });

      const clients = await service.fetchClients();

      expect(clients).toEqual(expectedTransformedResponseClient);
    });

    it('should throw an error if the API response is not an array', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: {},
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url: '',
            method: 'GET',
            headers: new AxiosHeaders(),
          },
        }),
      );

      await expect(service.fetchClients()).rejects.toThrow(
        'Dados não estão no formato esperado.',
      );
    });

    it('should throw an error if the API call fails', async () => {
      const mockError = new Error('API Error');
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw mockError;
      });

      await expect(service.fetchClients()).rejects.toThrow(
        'Erro ao consumir a API',
      );
    });
  });
  describe('fetchSales', () => {
    it('should fetch and transform sales correctly', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        // Valida diretamente a URL chamada
        expect(url).toBe(service.apiUrlSales);

        return of({
          data: mockApiResponseSales,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url,
            method: 'GET',
            headers: new AxiosHeaders(),
          },
        });
      });

      const sales = await service.fetchSales();

      expect(sales).toEqual(expectedTransformedResponseSales);
    });

    it('should throw an error if the API response is not an array', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        // Valida a URL chamada mesmo em caso de erro
        expect(url).toBe(service.apiUrlSales);

        return of({
          data: {},
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url,
            method: 'GET',
            headers: new AxiosHeaders(),
          },
        });
      });

      await expect(service.fetchSales()).rejects.toThrow(
        'Dados não estão no formato esperado.',
      );
    });

    it('should throw an error if the API call fails', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        // Valida a URL antes de simular o erro
        expect(url).toBe(service.apiUrlSales);

        throw new Error('API Error');
      });

      await expect(service.fetchSales()).rejects.toThrow(
        'Erro ao consumir a API',
      );
    });
  });

  describe('fetchData', () => {
    it('should fetch and transform data correctly', async () => {
      const mockMapper = jest.fn((data) => data);

      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        expect(url).toBe('https://example.com/api'); // Valida a URL chamada
        return of({
          data: mockApiResponse,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url,
            method: 'GET',
            headers: new AxiosHeaders(),
          },
        });
      });

      const result = await service.fetchData(
        'https://example.com/api',
        mockMapper,
      );

      expect(result).toEqual(expectedTransformedResponse);
      expect(mockMapper).toHaveBeenCalledTimes(mockApiResponse.length); // Valida que o mapper foi chamado para cada item

      // Valida que o primeiro argumento em cada chamada ao mapper corresponde ao item esperado
      mockApiResponse.forEach((item, index) => {
        expect(mockMapper.mock.calls[index][0]).toEqual(item);
      });
    });

    it('should throw an error if the response is not an array', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        expect(url).toBe('https://example.com/api'); // Valida a URL chamada
        return of({
          data: { message: 'Invalid response' },
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config: {
            url,
            method: 'GET',
            headers: new AxiosHeaders(),
          },
        });
      });

      await expect(
        service.fetchData('https://example.com/api', (data) => data),
      ).rejects.toThrow('Dados não estão no formato esperado.');
    });

    it('should throw an error if the request fails', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('Network Error');
      });

      await expect(
        service.fetchData('https://example.com/api', (data) => data),
      ).rejects.toThrow(
        'Erro ao consumir a API (https://example.com/api): Network Error',
      );
    });
  });
});

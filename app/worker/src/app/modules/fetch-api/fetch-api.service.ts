import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Client } from '../clients/interface/clients.interface';
import { Product } from '../products/interface/product.interface';
import { Sale } from '../sales/interface/sales.interface';

@Injectable()
export class FetchApiService {
  private readonly logger = new Logger(FetchApiService.name);
  readonly BASE_API_URL =
    process.env.API_URL ??
    'https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1';

  readonly apiUrlClients = `${this.BASE_API_URL}/clientes`;
  readonly apiUrlProducts = `${this.BASE_API_URL}/produtos`;
  readonly apiUrlSales = `${this.BASE_API_URL}/vendas`;

  constructor(private readonly http: HttpService) {
    if (!process.env.DEBUG_ALL && !process.env.FETCH_API) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }

    if (!process.env.API_URL) {
      this.logger.warn(
        `A variável de ambiente "API_URL" não está definida. Usando valor padrão: ${this.BASE_API_URL}`,
      );
    }
  }

  async fetchProducts(): Promise<Product[]> {
    return await this.fetchData<Product>(
      this.apiUrlProducts,
      (product: {
        id: string;
        nome: string;
        tipo: string;
        preco: string;
        sku: string;
        vendedor_id: string;
      }) => ({
        id: product.id,
        nome: product.nome,
        tipo: product.tipo,
        preco: product.preco,
        sku: product.sku,
        vendedor_id: product.vendedor_id,
      }),
    );
  }

  async fetchClients(): Promise<Client[]> {
    return await this.fetchData<Client>(
      this.apiUrlClients,
      (client: {
        id: string;
        nome: string;
        telefone: string;
        email: string;
      }) => ({
        id: client.id,
        nome: client.nome,
        telefone: client.telefone,
        email: client.email,
      }),
    );
  }

  async fetchSales(): Promise<Sale[]> {
    return await this.fetchData<Sale>(
      this.apiUrlSales,
      (sale: {
        vendedor_id: string;
        produto_id: string;
        cliente_id: string;
        id: string;
      }) => ({
        vendedor_id: sale.vendedor_id,
        produto_id: sale.produto_id,
        cliente_id: sale.cliente_id,
        id: sale.id,
      }),
    );
  }

  async fetchData<T>(apiUrl: string, mapper: (data: any) => T): Promise<T[]> {
    this.logger.log(`Iniciando requisição para a API: ${apiUrl}`);
    try {
      const response = await firstValueFrom(this.http.get(apiUrl));

      if (!Array.isArray(response.data)) {
        this.logger.warn(
          `Resposta inesperada recebida da API (${apiUrl}). Dados retornados: ${JSON.stringify(
            response.data,
          )}`,
        );
        throw new Error('Dados não estão no formato esperado.');
      }

      this.logger.log(
        `Requisição bem-sucedida. Foram encontrados ${response.data.length} itens.`,
      );

      return response.data.map(mapper);
    } catch (error: any) {
      this.logger.error(
        `Erro ao consumir a API (${apiUrl}): ${error.message}`,
        error.stack,
      );
      throw new Error(`Erro ao consumir a API (${apiUrl}): ${error.message}`);
    }
  }
}

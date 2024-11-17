import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Seller } from 'src/app/common/interface/seller.interface';

@Injectable()
export class FetchApiService {
  private readonly logger = new Logger(FetchApiService.name);
  // Usando a variável de ambiente FETCH_API ou o valor padrão
  private readonly apiUrl =
    process.env.API_URL ??
    'https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/vendedores';

  constructor(private readonly http: HttpService) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.FETCH_API) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }
  }

  /**
   * Busca a lista de vendedores da API.
   * @returns {Promise<Seller[]>} Lista de vendedores.
   * @throws {Error} Lança um erro se a API retornar uma falha.
   */
  async fetchSellers(): Promise<Seller[]> {
    this.logger.log('Buscando lista de vendedores da API...');
    try {
      // Usa firstValueFrom para converter o Observable em uma Promise
      const response = await firstValueFrom(this.http.get(this.apiUrl));

      if (!Array.isArray(response.data)) {
        this.logger.warn('Resposta inesperada da API de Vendedores.');
        throw new Error('Dados não estão no formato esperado.');
      }

      this.logger.log(`Foram encontrados ${response.data.length} vendedores.`);
      return response.data.map(
        (vendedor: { id: string; nome: string; telefone: string }) => ({
          id: vendedor.id,
          nome: vendedor.nome,
          telefone: vendedor.telefone,
        }),
      );
    } catch (error: any) {
      this.logger.error('Erro ao consumir a API de Vendedores:', error.message);
      throw new Error(`Erro ao consumir a API de Vendedores: ${error.message}`);
    }
  }
}

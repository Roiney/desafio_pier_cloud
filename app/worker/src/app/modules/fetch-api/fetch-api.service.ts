import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Client } from '../clients/interface/clients.interface';

@Injectable()
export class FetchApiService {
  private readonly logger = new Logger(FetchApiService.name);
  // Usando a variável de ambiente FETCH_API ou o valor padrão
  private readonly apiUrlClients =
    process.env.API_URL_CLIENTS ??
    'https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/clientes';

  constructor(private readonly http: HttpService) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.FETCH_API) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }

    if (!process.env.API_URL) {
      this.logger.warn(
        `A variável de ambiente "API_URL" não está definida. Usando valor padrão: ${this.apiUrlClients}`,
      );
    }
  }

  /**
   * Busca a lista de clientes da API.
   * @returns {Promise<Client[]>} Lista de clientes.
   * @throws {Error} Lança um erro se a API retornar uma falha.
   */
  async fetchClients(): Promise<Client[]> {
    this.logger.log(`Iniciando requisição para a API: ${this.apiUrlClients}`);
    try {
      // Usa firstValueFrom para converter o Observable em uma Promise
      const response = await firstValueFrom(this.http.get(this.apiUrlClients));

      if (!Array.isArray(response.data)) {
        this.logger.warn(
          `Resposta inesperada recebida da API. Dados retornados: ${JSON.stringify(
            response.data,
          )}`,
        );
        throw new Error('Dados não estão no formato esperado.');
      }

      this.logger.log(
        `Requisição bem-sucedida. Foram encontrados ${response.data.length} clientes.`,
      );

      return response.data.map(
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
    } catch (error: any) {
      this.logger.error(
        `Erro ao consumir a API: ${error.message}`,
        error.stack,
      );
      throw new Error(`Erro ao consumir a API de Clientes: ${error.message}`);
    }
  }
}

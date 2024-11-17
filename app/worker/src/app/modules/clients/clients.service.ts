import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { Client } from './interface/clients.interface';

@Injectable()
export class ClientsService implements OnModuleInit {
  private readonly logger = new Logger(ClientsService.name);

  constructor(private readonly fetchApiService: FetchApiService) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.JOBS) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }
  }

  /**
   * Método executado na inicialização do módulo.
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando ClientsService...');
    try {
      await this.clientsOrchestrator();
    } catch (error: any) {
      this.logger.error(
        `Erro ao inicializar ClientsService: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Orquestra o processo de busca e processamento dos vendedores.
   */
  async clientsOrchestrator(): Promise<void> {
    this.logger.log(
      'Iniciando o processo de orquestração do ClientsService...',
    );
    try {
      const clients: Client[] = await this.fetchApiService.fetchClients();

      if (!clients.length) {
        this.logger.warn('Nenhum cliente foi encontrado na API.');
        return;
      }

      this.logger.log(`Foram encontrados ${clients.length} clientes.`);

      for (const client of clients) {
        this.logger.log(
          `Processando cliente: ID=${client.id}, Nome=${client.nome}, Telefone=${client.telefone}, Email=${client.email}`,
        );
        // Adicione aqui a lógica para processar cada cliente
      }

      this.logger.log('Processo de orquestração concluído com sucesso.');
    } catch (error: any) {
      this.logger.error(
        `Erro durante a orquestração do ClientsService: ${error.message}`,
        error.stack,
      );
    }
  }
}

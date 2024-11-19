import { Injectable, Logger } from '@nestjs/common';
import { wlPierCloudClient } from '@prisma/client';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { Client } from './interface/clients.interface';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly fetchApiService: FetchApiService,
    private readonly prismaService: dbPrismaService,
  ) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.JOBS) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }
  }

  /**
   * Orquestra o processo de busca e processamento dos clientes.
   */
  async clientsOrchestrator(): Promise<void> {
    this.logger.log('Iniciando a orquestração do ClientsService...');
    try {
      const clients: Client[] = await this.fetchApiService.fetchClients();

      if (!clients.length) {
        this.logger.warn('Nenhum cliente encontrado na API.');
        return;
      }

      this.logger.log(
        `Encontrados ${clients.length} clientes para processamento.`,
      );

      for (const client of clients) {
        this.logger.log(
          `Processando cliente: ID=${client.id}, Nome=${client.nome}, Telefone=${client.telefone}, Email=${client.email}`,
        );

        const existingClient = await this.findOne(Number(client.id));
        if (existingClient) {
          this.logger.log(
            `Cliente com ID=${client.id} já registrado no banco de dados.`,
          );
          continue;
        }

        await this.registerClient(client);
        this.logger.log(`Cliente com ID=${client.id} registrado com sucesso.`);
      }

      this.logger.log('Orquestração de clientes concluída com sucesso.');
    } catch (error: any) {
      this.logger.error(
        `Erro durante a orquestração do ClientsService: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Busca um cliente pelo ID no banco de dados.
   * @param id ID do cliente
   * @returns Cliente ou null, se não encontrado.
   */
  async findOne(id: number): Promise<wlPierCloudClient | null> {
    try {
      return await this.prismaService.wlPierCloudClient.findUnique({
        where: { id },
      });
    } catch (error: any) {
      this.logger.error(
        `Erro ao buscar cliente com ID=${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Registra um novo cliente no banco de dados.
   * @param client Objeto do cliente
   * @returns Cliente registrado
   */
  async registerClient(client: Client): Promise<wlPierCloudClient> {
    try {
      if (!client.id || !client.nome || !client.telefone || !client.email) {
        throw new Error(
          `Dados inválidos para o cliente: ${JSON.stringify(client)}`,
        );
      }

      const registeredClient =
        await this.prismaService.wlPierCloudClient.create({
          data: {
            id: Number(client.id),
            nome: client.nome,
            telefone: client.telefone,
            email: client.email,
          },
        });

      return registeredClient;
    } catch (error: any) {
      this.logger.error(
        `Erro ao registrar cliente ID=${client.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

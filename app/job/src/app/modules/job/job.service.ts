import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Seller } from 'src/app/common/interface/seller.interface';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { MessagingPublisherService } from '../messaging-publisher/messaging-publisher.service';

@Injectable()
export class JobService implements OnModuleInit {
  private readonly logger = new Logger(JobService.name);

  constructor(
    private readonly fetchApiService: FetchApiService,
    private readonly messagingPublisherService: MessagingPublisherService,
  ) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.JOBS) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando JobService...');
    try {
      await this.jobOrchestrator();
    } catch (error: any) {
      this.logger.error('Erro ao inicializar JobService', error.message);
    }
  }

  /**
   * Orquestra o processo de busca de vendedores e publicação.
   */
  async jobOrchestrator(): Promise<void> {
    this.logger.log('Iniciando o processo de orquestração do JobService...');
    try {
      const sellers: Seller[] = await this.fetchApiService.fetchSellers();

      if (!sellers.length) {
        this.logger.warn('Nenhum vendedor foi encontrado na API.');
        return;
      }

      this.logger.log(`Foram encontrados ${sellers.length} vendedores.`);
      for (const seller of sellers) {
        this.logger.log(`Processando vendedor: ${seller.id} - ${seller.nome}`);
        await this.messagingPublisherService.sendSellerToBroker(seller);
      }

      this.logger.log('Processo de orquestração concluído com sucesso.');
    } catch (error: any) {
      this.logger.error(
        'Erro durante a orquestração do JobService:',
        error.message,
        error.stack,
      );
    }
  }
}

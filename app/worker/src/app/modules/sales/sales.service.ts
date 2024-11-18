import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { Sale } from './interface/sales.interface';

@Injectable()
export class SalesService implements OnModuleInit {
  private readonly logger = new Logger(SalesService.name);

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
    this.logger.log('Inicializando SalesService...');
    try {
      await this.salesOrchestrator();
    } catch (error: any) {
      this.logger.error(
        `Erro ao inicializar SalesService: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Orquestra o processo de busca e processamento das vendas.
   */
  async salesOrchestrator(): Promise<void> {
    this.logger.log('Iniciando o processo de orquestração do SalesService...');
    try {
      const sales: Sale[] = await this.fetchApiService.fetchSales();

      if (!sales.length) {
        this.logger.warn('Nenhuma venda foi encontrada na API.');
        return;
      }

      this.logger.log(`Foram encontradas ${sales.length} vendas.`);

      for (const sale of sales) {
        this.logger.log(
          `Processando venda: ID=${sale.id}, Vendedor ID=${sale.vendedor_id}, Produto ID=${sale.produto_id}, Cliente ID=${sale.cliente_id}`,
        );

        // Adicione aqui a lógica para processar cada venda
      }

      this.logger.log(
        'Processo de orquestração de vendas concluído com sucesso.',
      );
    } catch (error: any) {
      this.logger.error(
        `Erro durante a orquestração do SalesService: ${error.message}`,
        error.stack,
      );
    }
  }
}

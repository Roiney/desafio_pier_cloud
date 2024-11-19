import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { ProductsService } from '../products/products.service';
import { SalesService } from '../sales/sales.service';
import { SellerService } from '../seller/seller.service';

@Injectable()
export class GeneralOrchestratorService implements OnModuleInit {
  private readonly logger = new Logger(GeneralOrchestratorService.name);

  constructor(
    private readonly clientsService: ClientsService,
    private readonly sellerService: SellerService,
    private readonly productsService: ProductsService,
    private readonly salesService: SalesService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('🔄 Iniciando o GeneralOrchestratorService...');
    try {
      // Etapa 1: Processar clientes
      this.logger.log(
        '➡️ Chamando o método `clientsOrchestrator` do ClientsService...',
      );
      await this.clientsService.clientsOrchestrator();
      this.logger.log('✅ Método `clientsOrchestrator` concluído com sucesso.');

      // Etapa 2: Garantir registros no Seller
      this.logger.log('➡️ Verificando existência de registros no Seller...');
      await this.ensureSellersExist();
      this.logger.log('✅ Registros no Seller verificados com sucesso.');

      // Etapa 3: Processar produtos
      this.logger.log(
        '➡️ Chamando o método `productsOrchestrator` do ProductsService...',
      );
      await this.productsService.productsOrchestrator();
      this.logger.log(
        '✅ Método `productsOrchestrator` concluído com sucesso.',
      );

      // Etapa 4: Processar vendas
      this.logger.log(
        '➡️ Chamando o método `salesOrchestrator` do SalesService...',
      );
      await this.salesService.salesOrchestrator();
      this.logger.log('✅ Método `salesOrchestrator` concluído com sucesso.');

      this.logger.log('🎉 GeneralOrchestratorService executado com sucesso.');
    } catch (error: any) {
      this.logger.error(
        `❌ Erro durante a execução do GeneralOrchestratorService: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Garante que existam registros no Seller antes de prosseguir.
   * Faz pausas de 2 segundos e tenta novamente até que haja registros.
   * Lança erro após exceder o limite de tentativas.
   */
  private async ensureSellersExist(maxRetries = 5): Promise<void> {
    let retries = 0;

    while (retries < maxRetries) {
      const sellers = await this.sellerService.findMany();

      if (sellers.length > 0) {
        this.logger.log(
          `Foram encontrados ${sellers.length} vendedores no banco.`,
        );
        return;
      }

      retries++;
      this.logger.warn(
        `Nenhum vendedor encontrado (tentativa ${retries}/${maxRetries}). Aguardando 2 segundos antes de tentar novamente...`,
      );

      await this.delay(2000);
    }

    throw new Error(
      `Falha ao garantir registros no Seller após ${maxRetries} tentativas.`,
    );
  }

  /**
   * Pausa a execução por um determinado período.
   * @param ms Milissegundos para aguardar
   */
  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

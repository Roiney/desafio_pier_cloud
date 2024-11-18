import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { Product } from './interface/product.interface';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

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
    this.logger.log('Inicializando ProductsService...');
    try {
      await this.productsOrchestrator();
    } catch (error: any) {
      this.logger.error(
        `Erro ao inicializar ProductsService: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Orquestra o processo de busca e processamento dos produtos.
   */
  async productsOrchestrator(): Promise<void> {
    this.logger.log(
      'Iniciando o processo de orquestração do ProductsService...',
    );
    try {
      const products: Product[] = await this.fetchApiService.fetchProducts();

      if (!products.length) {
        this.logger.warn('Nenhum produto foi encontrado na API.');
        return;
      }

      this.logger.log(`Foram encontrados ${products.length} produtos.`);

      for (const product of products) {
        this.logger.log(
          `Processando produto: ID=${product.id}, Nome=${product.nome}, Tipo=${product.tipo}, Preço=${product.preco}`,
        );

        // Adicione aqui a lógica para processar cada produto
      }

      this.logger.log(
        'Processo de orquestração de produtos concluído com sucesso.',
      );
    } catch (error: any) {
      this.logger.error(
        `Erro durante a orquestração do ProductsService: ${error.message}`,
        error.stack,
      );
    }
  }
}

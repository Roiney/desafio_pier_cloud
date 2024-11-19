import { Injectable, Logger } from '@nestjs/common';
import { wlPierCloudProduct } from '@prisma/client';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { Product } from './interface/product.interface';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

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
   * Orquestra o processo de busca e processamento dos produtos.
   */
  async productsOrchestrator(): Promise<void> {
    this.logger.log('Iniciando a orquestração de produtos...');
    try {
      const products: Product[] = await this.fetchApiService.fetchProducts();

      if (!products.length) {
        this.logger.warn('Nenhum produto encontrado na API.');
        return;
      }

      this.logger.log(`Total de produtos encontrados: ${products.length}.`);

      for (const product of products) {
        this.logger.log(
          `Processando produto: ID=${product.id}, Nome="${product.nome}", Tipo="${product.tipo}", Preço=${product.preco}.`,
        );

        const existingProduct = await this.findProductById(Number(product.id));
        if (existingProduct) {
          this.logger.log(
            `Produto com ID=${product.id} já está registrado no banco de dados.`,
          );
          continue;
        }

        await this.createProduct(product);
        this.logger.log(`Produto com ID=${product.id} registrado com sucesso.`);
      }

      this.logger.log('Orquestração de produtos concluída com sucesso.');
    } catch (error: any) {
      this.logger.error(
        `Erro durante a orquestração de produtos: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Busca um produto pelo ID no banco de dados.
   * @param id ID do produto
   * @returns Produto encontrado ou null
   */
  async findProductById(id: number): Promise<wlPierCloudProduct | null> {
    try {
      return await this.prismaService.wlPierCloudProduct.findUnique({
        where: { id },
      });
    } catch (error: any) {
      this.logger.error(
        `Erro ao buscar produto com ID=${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Registra um novo produto no banco de dados.
   * @param product Objeto do produto
   * @returns Produto registrado
   */
  async createProduct(product: Product): Promise<wlPierCloudProduct> {
    try {
      if (
        !product.id ||
        !product.nome ||
        !product.preco ||
        !product.sku ||
        !product.tipo ||
        !product.vendedor_id
      ) {
        throw new Error(
          `Dados inválidos para o produto: ${JSON.stringify(product)}`,
        );
      }

      const newProduct = await this.prismaService.wlPierCloudProduct.create({
        data: {
          id: Number(product.id),
          nome: product.nome,
          tipo: product.tipo,
          preco: product.preco, // Assumindo que "preco" já foi validado como um Decimal
          sku: product.sku,
          vendedor_id: Number(product.vendedor_id),
        },
      });

      return newProduct;
    } catch (error: any) {
      this.logger.error(
        `Erro ao registrar produto ID=${product.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

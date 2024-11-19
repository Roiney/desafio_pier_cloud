import { Injectable, Logger } from '@nestjs/common';
import { wlPierCloudSale } from '@prisma/client';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { Sale, SaleWithRelations } from './interface/sales.interface';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

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
   * Orchestrates the process of fetching and registering sales data.
   *
   * @returns {Promise<void>} A promise that resolves when the orchestration process is complete.
   * @throws {Error} If an error occurs during the orchestration process.
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

        const thisSaleExistInDB = await this.findOne(Number(sale.id));
        if (thisSaleExistInDB) {
          this.logger.log(
            `Venda de id ${sale.id} já possui registro em banco.`,
          );
          continue;
        }

        await this.registerSale(sale);
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

  /**
   * Finds a sale by its ID.
   *
   * @param {number} id - The ID of the sale to find.
   * @returns {Promise<wlPierCloudSale | null>} A promise that resolves to the sale if found, or null otherwise.
   * @throws {Error} If an error occurs during the search process.
   */
  async findOne(id: number): Promise<wlPierCloudSale | null> {
    try {
      return await this.prismaService.wlPierCloudSale.findUnique({
        where: { id },
      });
    } catch (error: any) {
      this.logger.error(
        `Erro ao buscar a venda ID=${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Registers a new sale in the database.
   *
   * @param {Sale} sale - The sale data to register.
   * @returns {Promise<wlPierCloudSale>} A promise that resolves to the registered sale.
   * @throws {Error} If the sale data is invalid or if an error occurs during the registration process.
   */
  async registerSale(sale: Sale): Promise<wlPierCloudSale> {
    try {
      if (
        !sale.id ||
        !sale.cliente_id ||
        !sale.vendedor_id ||
        !sale.produto_id
      ) {
        throw new Error(
          `Dados inválidos para a venda: ${JSON.stringify(sale)}`,
        );
      }

      const registeredSale = await this.prismaService.wlPierCloudSale.create({
        data: {
          id: Number(sale.id),
          cliente_id: Number(sale.cliente_id),
          vendedor_id: Number(sale.vendedor_id),
          produto_id: Number(sale.produto_id),
        },
      });

      return registeredSale;
    } catch (error: any) {
      this.logger.error(
        `Erro ao registrar a venda ID=${sale.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetches sales data from the database, including related entities: cliente, produto, and vendedor.
   *
   * @returns {Promise<SaleWithRelations[]>} A promise that resolves to an array of sales with related entities.
   * @throws {Error} If an error occurs during the data fetching process.
   */
  async fetchSalesData(): Promise<SaleWithRelations[]> {
    try {
      return await this.prismaService.wlPierCloudSale.findMany({
        include: {
          cliente: true,
          produto: true,
          vendedor: true,
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Erro ao buscar dados de vendas: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

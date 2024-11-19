import { Injectable, Logger } from '@nestjs/common';
import { wlPierCloudSale } from '@prisma/client';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';
import { FetchApiService } from '../fetch-api/fetch-api.service';
import { Sale } from './interface/sales.interface';

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

  async findOne(id: number): Promise<wlPierCloudSale | null> {
    return await this.prismaService.wlPierCloudSale.findUnique({
      where: { id },
    });
  }

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

      const regissterSale = await this.prismaService.wlPierCloudSale.create({
        data: {
          id: Number(sale.id),
          cliente_id: Number(sale.cliente_id),
          vendedor_id: Number(sale.vendedor_id),
          produto_id: Number(sale.produto_id),
        },
      });

      return regissterSale;
    } catch (error: any) {
      this.logger.error(
        `Erro ao registrar a venda ID=${sale.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

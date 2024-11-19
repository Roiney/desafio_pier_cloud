import { Injectable, Logger } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import { SaleWithRelations } from '../sales/interface/sales.interface';
import { SalesService } from '../sales/sales.service';
import { FormattedSaleData } from './interface/reports.interface';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly salesService: SalesService) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.JOBS) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }
  }

  async generateSalesReport(filePath: string): Promise<void> {
    this.logger.log('Iniciando a geração do relatório de vendas...');
    try {
      // Etapa 1: Buscar dados
      const salesData = await this.salesService.fetchSalesData();
      if (!salesData.length) {
        this.logger.warn('Nenhuma venda encontrada para exportação.');
        return;
      }

      this.logger.log(`Total de vendas encontradas: ${salesData.length}.`);

      // Etapa 2: Mapear e formatar dados
      const formattedData = this.formatSalesData(salesData);

      // Etapa 3: Exportar dados
      await this.export(formattedData, filePath);

      this.logger.log('Relatório de vendas gerado com sucesso.');
    } catch (error: any) {
      this.logger.error(
        `Erro durante a geração do relatório de vendas: ${error.message}`,
        error.stack,
      );
    }
  }

  async export(data: FormattedSaleData[], path: string): Promise<void> {
    const csvWriter = createObjectCsvWriter({
      path,
      header: [
        { id: 'vendedor_id', title: 'ID do Vendedor' },
        { id: 'vendedor_nome', title: 'Nome do Vendedor' },
        { id: 'vendedor_telefone', title: 'Telefone do Vendedor' },
        { id: 'cliente_id', title: 'ID do Cliente' },
        { id: 'cliente_nome', title: 'Nome do Cliente' },
        { id: 'cliente_telefone', title: 'Telefone do Cliente' },
        { id: 'cliente_email', title: 'Email do Cliente' },
        { id: 'produto_id', title: 'ID do Produto' },
        { id: 'produto_nome', title: 'Nome do Produto' },
        { id: 'produto_preco', title: 'Preço do Produto' },
        { id: 'produto_sku', title: 'SKU do Produto' },
      ],
    });

    try {
      await csvWriter.writeRecords(data);
      this.logger.log(`Relatório exportado com sucesso para: ${path}`);
    } catch (error: any) {
      this.logger.error(
        `Erro ao exportar dados para CSV: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Formata os dados das vendas para exportação.
   * @param sales Dados das vendas
   * @returns {FormattedSaleData[]} Dados formatados para exportação
   */
  private formatSalesData(sales: SaleWithRelations[]): FormattedSaleData[] {
    return sales.map((sale) => ({
      vendedor_id: sale.vendedor?.id ?? null,
      vendedor_nome: sale.vendedor?.name ?? null,
      vendedor_telefone: sale.vendedor?.phone ?? null,
      cliente_id: sale.cliente?.id ?? null,
      cliente_nome: sale.cliente?.nome ?? null,
      cliente_telefone: sale.cliente?.telefone ?? null,
      cliente_email: sale.cliente?.email ?? null,
      produto_id: sale.produto?.id ?? null,
      produto_nome: sale.produto?.nome ?? null,
      produto_preco: sale.produto?.preco ?? null,
      produto_sku: sale.produto?.sku ?? null,
    }));
  }
}

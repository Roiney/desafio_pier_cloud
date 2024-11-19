import { BadRequestException, Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Endpoint para gerar e baixar um relatório de vendas em formato CSV.
   *
   * @param res Objeto de resposta do Express para realizar o download.
   * @returns {Promise<void>} Não retorna dados diretamente, mas realiza o download do arquivo.
   */
  @ApiOperation({
    summary: 'Gera e baixa o relatório de vendas',
    description:
      'Este endpoint gera um relatório de vendas em formato CSV e o disponibiliza para download.',
  })
  @ApiResponse({
    status: 200,
    description: 'O relatório foi gerado e baixado com sucesso.',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao gerar ou baixar o relatório.',
  })
  @Get()
  async getCSV(@Res() res: Response): Promise<void> {
    const fileName = `report.csv`;
    const filePath = path.join(__dirname, fileName);

    try {
      // Gera o relatório e salva no caminho especificado
      await this.reportsService.generateSalesReport(filePath);

      // Realiza o download do arquivo gerado
      res.download(filePath, (err: any) => {
        if (err) {
          console.error('Erro ao fazer o download do relatório:', err);
          throw new BadRequestException(
            'Erro ao fazer o download do relatório.',
          );
        }

        console.log('Relatório baixado com sucesso.');

        // Remove o arquivo temporário após o download
        try {
          fs.unlinkSync(filePath);
          console.log('Arquivo temporário removido com sucesso.');
        } catch (unlinkError) {
          console.error('Erro ao remover o arquivo temporário:', unlinkError);
        }
      });
    } catch (error: any) {
      console.error('Erro ao gerar ou baixar o relatório:', error);
      throw new BadRequestException('Erro ao gerar ou baixar o relatório.');
    }
  }
}

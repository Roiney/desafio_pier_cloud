import { Injectable } from '@nestjs/common';
import { wlPierCloudSeller } from '@prisma/client';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';

@Injectable()
export class SellerService {
  constructor(private readonly prismaService: dbPrismaService) {}

  async findOne(id: number): Promise<wlPierCloudSeller | null> {
    const seller = await this.prismaService.wlPierCloudSeller.findUnique({
      where: { id },
    });
    return seller;
  }

  async findMany(): Promise<wlPierCloudSeller[]> {
    const sellers = await this.prismaService.wlPierCloudSeller.findMany({});
    return sellers;
  }

  /**
   * Registra ou atualiza informações de um vendedor no banco de dados.
   * @param sellerId - ID único do vendedor.
   * @param name - Nome do vendedor.
   * @param phone - Telefone do vendedor.
   * @returns O registro atualizado ou criado no banco.
   */
  async registerSeller(
    id: number,
    name: string,
    phone: string,
  ): Promise<wlPierCloudSeller> {
    try {
      const seller = await this.prismaService.wlPierCloudSeller.create({
        data: {
          id,
          name,
          phone,
        },
      });

      return seller; // Retorna o registro atualizado ou criado
    } catch (error: any) {
      throw new Error(`Erro ao registrar vendedor: ${error.message}`);
    }
  }
}

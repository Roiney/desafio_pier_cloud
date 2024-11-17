import { Injectable, Logger } from '@nestjs/common';
import { SellerService } from '../seller/seller.service';
import { BrokerMessage } from './interface/broker.interface';

@Injectable()
export class MessagingReceiverService {
  private readonly logger = new Logger(MessagingReceiverService.name);

  constructor(private readonly sellerService: SellerService) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.MESSAGING_RECEIVER) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }
  }

  /**
   * Registra informações do vendedor recebidas na mensagem do broker.
   * @param message - Objeto contendo os dados do vendedor.
   */
  async registerSeller(message: BrokerMessage): Promise<any> {
    try {
      this.logger.log(`Recebendo mensagem com ID: ${message.id}`);

      // Verifica se a mensagem tem dados válidos
      if (!message?.data) {
        this.logger.error(
          `Mensagem inválida recebida: ${JSON.stringify(message)}`,
        );
        throw new Error('Mensagem inválida ou mal formatada.');
      }

      const { id, name, phone } = message.data;

      // Lógica para registrar o vendedor (exemplo fictício)
      const result = await this.sellerService.registerSeller(
        Number(id),
        name,
        phone,
      );
      this.logger.log(
        `Vendedor registrado com sucesso: ${JSON.stringify(result)}`,
      );
      return result;
    } catch (error: any) {
      this.logger.error(
        `Erro ao registrar o vendedor: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

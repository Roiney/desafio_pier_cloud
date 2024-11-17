import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Seller } from 'src/app/common/interface/seller.interface';

@Injectable()
export class MessagingPublisherService {
  private readonly logger = new Logger(MessagingPublisherService.name);
  constructor(
    @Inject(process.env.BROKER_CLIENT ?? 'default-broker-client')
    private readonly brokerClient: ClientProxy, // Renomeei para brokerClient para refletir o contexto
  ) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.MESSAGING_PUBLISHER) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }

    const brokerEnvVars: Array<keyof AppProcessEnv> = [
      'BROKER_CLIENT',
      'BROKER_EVENT',
    ];
    brokerEnvVars.forEach((envVar) => {
      const value = process.env[envVar] ?? this.getDefaultEnvValue(envVar);
      this.logger.log(`Variável de ambiente carregada: ${envVar} = ${value}`);
      if (!process.env[envVar]) {
        process.env[envVar] = value;
      }
    });
  }

  /**
   * Envia informações de um vendedor para o broker de mensageria.
   * @param seller - Objeto contendo informações do vendedor.
   */
  async sendSellerToBroker(seller: Seller): Promise<void> {
    try {
      const messageId = `${Math.floor(Math.random() * 1000)}`; // Garantir ID mais descritivo

      // Emitindo evento para o broker
      await this.brokerClient
        .emit(process.env.BROKER_EVENT, {
          id: messageId,
          data: {
            id: seller.id,
            name: seller.nome, // Ajustado para "name" conforme a chave do payload
            phone: seller.telefone, // Ajustado para "phone" conforme a chave do payload
          },
        })
        .toPromise();

      this.logger.log(`Mensagem enviada para o broker com ID: ${messageId}`);
    } catch (error: any) {
      this.logger.error(
        `Erro ao enviar mensagem para o broker: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Retorna valores padrão para variáveis de ambiente não definidas.
   * @param envVar - Nome da variável de ambiente.
   * @returns Valor padrão para o ambiente de teste técnico.
   */
  private getDefaultEnvValue(envVar: keyof AppProcessEnv): string {
    const defaultValues: Partial<AppProcessEnv> = {
      BROKER_CLIENT: 'default-broker-client',
      BROKER_EVENT: 'default-broker-event',
    };

    this.logger.warn(
      `Variável de ambiente ${envVar} não definida. Usando valor padrão: ${defaultValues[envVar]}`,
    );
    return defaultValues[envVar] ?? '(valor padrão não definido)';
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Seller } from 'src/app/common/interface/seller.interface';

@Injectable()
export class MessagingPublisherService {
  private readonly logger = new Logger(MessagingPublisherService.name);

  constructor(
    @Inject(process.env.BROKER_CLIENT ?? 'default-broker-client')
    private readonly brokerClient: ClientProxy,
  ) {
    this.configureEnvironmentVariables();
  }

  /**
   * Configura variáveis de ambiente necessárias para o funcionamento do serviço.
   */
  private configureEnvironmentVariables(): void {
    const brokerEnvVars: Array<keyof AppProcessEnv> = [
      'BROKER_CLIENT',
      'BROKER_EVENT',
    ];

    brokerEnvVars.forEach((envVar) => {
      const value = process.env[envVar] ?? this.getDefaultEnvValue(envVar);
      this.logger.log(
        `✅ Variável de ambiente carregada: ${envVar} = ${value}`,
      );
      if (!process.env[envVar]) {
        process.env[envVar] = value; // Define a variável no ambiente se estiver ausente
      }
    });
  }

  /**
   * Tenta conectar ao RabbitMQ com lógica de reconexão.
   */
  async connectToRabbitMQ(): Promise<void> {
    const maxRetries = 500;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await this.brokerClient.connect();
        this.logger.log('✅ Conexão com RabbitMQ estabelecida com sucesso.');
        return; // Conexão bem-sucedida
      } catch (error) {
        retries++;
        this.logger.warn(
          `❌ Falha ao conectar ao RabbitMQ. Tentativa ${retries}/${maxRetries}. Retentando em 5 segundos...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Espera antes de tentar novamente
      }
    }

    throw new Error(
      '❌ Não foi possível conectar ao RabbitMQ após várias tentativas.',
    );
  }

  /**
   * Envia informações de um vendedor para o broker de mensageria.
   *
   * @param seller - Objeto contendo informações do vendedor.
   * @throws {Error} - Caso ocorra um erro durante o envio da mensagem.
   */
  async sendSellerToBroker(seller: Seller): Promise<void> {
    const messageId = `${Math.floor(Math.random() * 1000)}`; // Gerar ID aleatório para a mensagem
    const brokerEvent = process.env.BROKER_EVENT;

    try {
      if (!brokerEvent) {
        throw new Error('Variável de ambiente "BROKER_EVENT" não definida.');
      }

      this.logger.log(
        `➡️ Emitindo evento para o broker: ${brokerEvent}, Mensagem ID: ${messageId}`,
      );

      // Emitindo evento para o broker com os dados do vendedor
      await this.brokerClient
        .emit(brokerEvent, {
          id: messageId,
          data: {
            id: seller.id,
            name: seller.nome, // Usando chave 'name' para consistência no payload
            phone: seller.telefone, // Usando chave 'phone' para consistência no payload
          },
        })
        .toPromise();

      this.logger.log(
        `✅ Mensagem enviada ao broker com sucesso. ID: ${messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Erro ao enviar mensagem para o broker: ${(error as Error).message}`,
        { stack: (error as Error).stack, seller, messageId },
      );
      throw error;
    }
  }

  /**
   * Retorna valores padrão para variáveis de ambiente não definidas.
   *
   * @param envVar - Nome da variável de ambiente.
   * @returns Valor padrão definido ou um valor de fallback.
   */
  private getDefaultEnvValue(envVar: keyof AppProcessEnv): string {
    const defaultValues: Partial<AppProcessEnv> = {
      BROKER_CLIENT: 'default-broker-client',
      BROKER_EVENT: 'default-broker-event',
    };

    const fallback = defaultValues[envVar] ?? '(valor padrão não definido)';
    this.logger.warn(
      `⚠️ Variável de ambiente "${envVar}" não definida. Usando valor padrão: ${fallback}`,
    );
    return fallback;
  }
}

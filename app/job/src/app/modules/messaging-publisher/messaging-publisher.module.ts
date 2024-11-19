import { Global, Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingPublisherService } from './messaging-publisher.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: validateEnv('BROKER_CLIENT', 'default-broker-client'),
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${validateEnv('RABBITMQ_USERNAME', 'guest')}:${validateEnv(
              'RABBITMQ_PASSWORD',
              'guest',
            )}@${validateEnv('RABBITMQ_HOST', 'rabbitmq')}:${validateEnv('RABBITMQ_PORT', '5672')}`,
          ],
          queue: validateEnv('BROKER_QUEUE', 'default-broker-queue'),
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [MessagingPublisherService],
  exports: [MessagingPublisherService],
})
export class MessagingPublisherModule {
  private readonly logger = new Logger(MessagingPublisherModule.name);

  constructor() {
    const requiredEnvVars: Array<keyof AppProcessEnv> = [
      'RABBITMQ_USERNAME',
      'RABBITMQ_PASSWORD',
      'RABBITMQ_HOST',
      'RABBITMQ_PORT',
      'BROKER_CLIENT',
      'BROKER_QUEUE',
      'BROKER_EVENT',
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        this.logger.error(
          `❌ Variável de ambiente "${envVar}" não está definida! Isso pode afetar algumas funcionalidades.`,
        );
      } else {
        this.logger.log(
          `✅ Variável de ambiente "${envVar}" carregada: ${process.env[envVar]}`,
        );
      }
    }
  }
}

/**
 * Função para validar variáveis de ambiente, com valores padrão.
 */
function validateEnv(envVar: string, defaultValue: string): string {
  const value = process.env[envVar] ?? defaultValue;
  const logger = new Logger('EnvironmentValidation');
  if (value === defaultValue) {
    logger.warn(
      `⚠️ Variável de ambiente "${envVar}" não está definida. Usando valor padrão: "${defaultValue}"`,
    );
  }
  return value;
}

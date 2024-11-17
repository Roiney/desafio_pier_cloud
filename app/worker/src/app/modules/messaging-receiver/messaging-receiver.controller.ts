import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { BrokerMessage } from './interface/broker.interface';
import { MessagingReceiverService } from './messaging-receiver.service';

@Controller('messaging-receiver')
export class MessagingReceiverController {
  private readonly logger = new Logger(MessagingReceiverController.name);
  private readonly eventPattern: string;

  constructor(
    private readonly messagingReceiverService: MessagingReceiverService,
  ) {
    // Configura os níveis de log dependendo das variáveis de ambiente
    if (!process.env.DEBUG_ALL && !process.env.MESSAGING_RECEIVER) {
      Logger.overrideLogger(['log', 'warn', 'error']);
    }

    this.eventPattern = process.env.BROKER_EVENT ?? 'default-broker-event';

    if (!process.env.BROKER_EVENT) {
      this.logger.warn(
        `A variável de ambiente "BROKER_EVENT" não está definida. Usando valor padrão: ${this.eventPattern}`,
      );
    }
  }

  @MessagePattern(process.env.BROKER_EVENT ?? 'default-broker-event')
  async receivingEvents(
    @Payload() message: BrokerMessage,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    this.logger.log(`Evento recebido: ${JSON.stringify(message)}`);

    try {
      // Processa a mensagem
      await this.messagingReceiverService.registerSeller(message);
      // Confirma o recebimento da mensagem
      channel.ack(originalMsg);
      this.logger.log('Mensagem processada com sucesso.');
    } catch (error: any) {
      // Em caso de erro, rejeita a mensagem e a reenvia para a fila
      channel.reject(originalMsg, true);
      this.logger.error('Erro ao processar a mensagem', error.stack);
    }

    return message;
  }
}

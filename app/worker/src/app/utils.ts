/**
 * Obtém a string de conexão com o RabbitMQ.
 * @returns A string de conexão com o RabbitMQ.
 */
export function getRabbitMQConnectionString(): string {
  return `amqp://${process.env.RABBITMQ_USERNAME ?? ''}:${
    process.env.RABBITMQ_PASSWORD ?? ''
  }@${process.env.RABBITMQ_HOST ?? ''}:${
    process.env.RABBITMQ_PORT ?? ''
  }${`/${process.env.RABBITMQ_VHOST ?? ''}`}`;
}

/**
 * Obtém o caminho base para a API.
 * @returns O caminho base para a API.
 */
export function getBasePath(): string {
  if (process.env.NODE_ENV === 'production') {
    return '/registros';
  }
  return '';
}

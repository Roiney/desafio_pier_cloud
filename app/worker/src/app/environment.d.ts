interface AppProcessEnv {
  /**
   * Indicates the type of environment Node is currently running on.
   * @example "development"
   */
  NODE_ENV?: 'development' | 'production' | 'test';

  /**
   * The username for connecting to the RabbitMQ broker.
   * @example "guest"
   */
  RABBITMQ_USERNAME?: string;

  /**
   * The password for connecting to the RabbitMQ broker.
   * @example "guest"
   */
  RABBITMQ_PASSWORD?: string;

  /**
   * The host address of the RabbitMQ broker.
   * @example "localhost"
   */
  RABBITMQ_HOST?: string;

  /**
   * The port of the RabbitMQ broker.
   * @example "5672"
   */
  RABBITMQ_PORT?: string;

  /**
   * The name of the client used for communication with the broker.
   * @example "kafka-broker-client"
   */
  BROKER_CLIENT?: string;

  /**
   * The name of the queue used for processing messages.
   * @example "default-queue"
   */
  BROKER_QUEUE?: string;

  /**
   * The event name used for publishing messages to the broker.
   * @example "seller-updated-event"
   */
  BROKER_EVENT?: string;
}

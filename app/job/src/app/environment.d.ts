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

  /**
   * Enables detailed logging for the messaging publisher service.
   * @example "true"
   */
  MESSAGING_PUBLISHER?: string;

  /**
   * Enables detailed logging across all services and components.
   * @example "true"
   */
  DEBUG_ALL?: string;

  /**
   * Enables or disables background job execution.
   * @example "true"
   */
  JOBS?: string;

  /**
   * Base URL for the Fetch API service.
   * @example "https://api.example.com/v1"
   */
  FETCH_API?: string;

  /**
   * Base URL for the Fetch API service.
   * Defaults to the mock API URL if not set.
   * @example "https://api.example.com/v1"
   */
  API_URL?: string;
}

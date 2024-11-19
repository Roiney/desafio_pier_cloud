import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express'; // Importa o NestExpressApplication
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { getRabbitMQConnectionString } from './utils';

async function bootstrap(): Promise<void> {
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
      console.error(
        `Environment variable "${envVar}" is not defined! Application cannot start.`,
      );
      return;
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  }); // Define o tipo como NestExpressApplication

  // Configure body parser middleware
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Define o prefixo global para todas as rotas caso definido na variável de
  // ambiente process.env.GLOBAL_PREFIX.
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? '');

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidUnknownValues: false }),
  );

  const internalDocsConfig = new DocumentBuilder()
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .setTitle('Worker')
    .addServer('http://localhost:3000', 'Development server')
    .addBearerAuth();

  const internalDocsDocument = SwaggerModule.createDocument(
    app,
    internalDocsConfig.build(),
  );
  SwaggerModule.setup('docs', app, internalDocsDocument);

  const queues: Array<keyof AppProcessEnv> = ['BROKER_QUEUE'];

  for (const queue of queues) {
    await connectMicroserviceToQueue(app, process.env[queue]);
  }

  await app.startAllMicroservices();

  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT, '0.0.0.0');
  const blue = (text: string): string => `\t\x1b[36m${text}\x1b[0m`;
  console.log(
    `[🤖]: RabbitMQ is running on:   ${blue(`${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`)}`,
  );
  const dbHost = String(process.env?.DATABASE_URL?.match(/(?<=@).+(?=\/)/));
  console.log(`[🤖]: Database is connected on: ${blue(dbHost)}`);
  console.log(
    `[🤖]: Application is running on: ${blue(`${await app.getUrl()}/${process.env.GLOBAL_PREFIX ?? ''}`)}`,
  );
}

async function connectMicroserviceToQueue(
  app: any,
  queue: string | undefined,
  prefetchCount: number = 1000,
): Promise<void> {
  try {
    const options: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [getRabbitMQConnectionString()],
        queue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
        prefetchCount,
        // deserializer: {
        //   deserialize(data: any): { pattern: string; data: any } {
        //     // Os dados de localização da Flespi são enviados são enviados para
        //     // a sua devida fila sem informações de padrão de mensagem.
        //     // Como o módulo de microsserviço do NestJS exige um padrão de
        //     // mensagens no formato { pattern: string, data: any }, é necessário
        //     // adicionar um padrão de mensagem para as mensagens de localização
        //     // da Flespi.
        //     if (queue === process.env.QUEUE_LOCATION_IN_FLESPI) {
        //       return {
        //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //         pattern: process.env.EVENT_LOCATION_IN_FLESPI!,
        //         data,
        //       };
        //     }
        //     return data;
        //   },
        // },
      },
    };
    await app.connectMicroservice(options);
    console.log(`[🤖]: Microservice connected RabbitMQ to queue: ${queue}`);
  } catch (error: any) {
    console.error(
      `Error connecting microservice to queue ${queue}:`,
      error.message,
    );
    setTimeout(() => {
      void connectMicroserviceToQueue(app, queue);
    }, 5000); // Tentar reconectar após 5 segundos
  }
}

bootstrap().catch((e) => {
  console.error(e);
});

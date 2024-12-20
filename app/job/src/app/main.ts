import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .setTitle('NestJS Repository Pattern')
    .setDescription('Repository for initialize the project.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT ?? 3001;

  await app.listen(PORT, '0.0.0.0');
  const blue = (text: string): string => `\t\x1b[36m${text}\x1b[0m`;
  console.log(
    `[🤖]: RabbitMQ is running on:   ${blue(`${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`)}`,
  );

  console.log(
    `[🤖]: Application is running on: ${blue(`${await app.getUrl()}/${process.env.GLOBAL_PREFIX ?? ''}`)}`,
  );
}

bootstrap().catch((e) => {
  console.log(e);
});

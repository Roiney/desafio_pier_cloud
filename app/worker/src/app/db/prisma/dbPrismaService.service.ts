import {
  Injectable,
  Logger,
  type INestApplication,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class dbPrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<any> {
    logger.log(`Connecting to the database...`);
    await this.$connect().then(() => {
      logger.log(`Connected to the database.`);
    });
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', () => {
      app.close(); // eslint-disable-line @typescript-eslint/no-floating-promises
    });
  }
}

const logger = new Logger('📚 ' + dbPrismaService.name);

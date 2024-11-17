import {
  HttpExceptionOptions,
  Injectable,
  ServiceUnavailableException
} from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';
import { dbPrismaService } from 'src/app/db/prisma/dbPrismaService.service';

@Injectable()
export class PrismaOrmHealthIndicator extends HealthIndicator {
  constructor(

    private readonly prismaService: dbPrismaService,
  ) {
    super();
  }

  async pingCheck(
    databaseName: string,
  ): Promise<string | HttpExceptionOptions | undefined> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return this.getStatus(databaseName, true);
    } catch (error) {
      // Acessando o erro de forma segura
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      throw new ServiceUnavailableException(
        `Get in touch with the infrastructure: ${errorMessage}`,
      );
    }
  }
}

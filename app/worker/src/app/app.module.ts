import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { GlobalHttpModule } from './global/http/global-http.module';
import { ClientsModule } from './modules/clients/clients.module';
import { FetchApiModule } from './modules/fetch-api/fetch-api.module';
import { HealthModule } from './modules/health/health.module';
import { MessagingReceiverModule } from './modules/messaging-receiver/messaging-receiver.module';
import { SellerModule } from './modules/seller/seller.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { GeneralOrchestratorModule } from './modules/general-orchestrator/general-orchestrator.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    GlobalHttpModule,
    HealthModule,
    MessagingReceiverModule,
    SellerModule,
    FetchApiModule,
    ClientsModule,
    ProductsModule,
    SalesModule,
    GeneralOrchestratorModule,
    ReportsModule,
  ],
})
export class AppModule {}

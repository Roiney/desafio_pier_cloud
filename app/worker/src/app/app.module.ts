import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { HealthModule } from './modules/health/health.module';
import { MessagingReceiverModule } from './modules/messaging-receiver/messaging-receiver.module';
import { SellerModule } from './modules/seller/seller.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    HealthModule,
    MessagingReceiverModule,
    SellerModule,
  ],
})
export class AppModule {}

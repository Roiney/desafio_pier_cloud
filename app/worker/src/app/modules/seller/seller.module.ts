import { Global, Module } from '@nestjs/common';
import { SellerService } from './seller.service';

@Global()
@Module({
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}

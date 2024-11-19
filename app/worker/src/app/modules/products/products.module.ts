import { Global, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
@Global()
@Module({
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

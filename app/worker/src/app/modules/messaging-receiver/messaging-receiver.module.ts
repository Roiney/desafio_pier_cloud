import { Module } from '@nestjs/common';
import { MessagingReceiverService } from './messaging-receiver.service';
import { MessagingReceiverController } from './messaging-receiver.controller';

@Module({
  controllers: [MessagingReceiverController],
  providers: [MessagingReceiverService],
})
export class MessagingReceiverModule {}

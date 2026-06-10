import { Module } from '@nestjs/common';
import { AdminFaqController, PublicFaqController } from './faq.controller';
import { FaqService } from './faq.service';

@Module({
  controllers: [PublicFaqController, AdminFaqController],
  providers: [FaqService],
})
export class FaqModule {}

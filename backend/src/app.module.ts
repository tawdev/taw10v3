import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ContactsModule } from './contacts/contacts.module';
import { configuration } from './config/configuration';
import { CustomersModule } from './customers/customers.module';
import { FaqModule } from './faq/faq.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { PricingModule } from './pricing/pricing.module';
import { ServicesModule } from './services/services.module';
import { TeamModule } from './team/team.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminModule,
    BlogModule,
    TeamModule,
    ServicesModule,
    PricingModule,
    OrdersModule,
    ContactsModule,
    CustomersModule,
    FaqModule,
  ],
})
export class AppModule {}

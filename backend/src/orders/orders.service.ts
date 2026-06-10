import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customersService: CustomersService,
  ) {}

  async create(dto: CreateOrderDto) {
    // Generate unique order number TAW-YYYY-XXXX
    const count = await this.prisma.order.count();
    const year = new Date().getFullYear();
    const orderNumber = `TAW-${year}-${String(count + 1).padStart(4, '0')}`;

    const customer = await this.customersService.upsertFromReservation({
      fullName: dto.customerName,
      email: dto.email,
      phone: dto.phone,
    });

    return this.prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName: dto.customerName,
        phone: dto.phone,
        email: dto.email,
        selectedPlan: dto.selectedPlan,
        notes: dto.notes,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}

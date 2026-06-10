import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    await this.syncFromOrders();
    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({
        data: {
          fullName: dto.fullName.trim(),
          email: this.cleanOptional(dto.email),
          phone: dto.phone.trim(),
          companyName: dto.companyName?.trim() ?? '',
        },
      });
    } catch (error) {
      this.throwDuplicateError(error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.ensureExists(id);

    try {
      return await this.prisma.customer.update({
        where: { id },
        data: {
          ...(dto.fullName !== undefined ? { fullName: dto.fullName.trim() } : {}),
          ...(dto.email !== undefined ? { email: this.cleanOptional(dto.email) } : {}),
          ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
          ...(dto.companyName !== undefined ? { companyName: dto.companyName.trim() } : {}),
        },
      });
    } catch (error) {
      this.throwDuplicateError(error);
      throw error;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.customer.delete({ where: { id } });
  }

  async upsertFromReservation(data: { fullName: string; email?: string | null; phone: string }) {
    const fullName = data.fullName.trim();
    const phone = data.phone.trim();
    const email = this.cleanOptional(data.email ?? undefined);
    const existing = await this.findByEmailOrPhone(email, phone);

    if (existing) {
      return this.prisma.customer.update({
        where: { id: existing.id },
        data: {
          fullName: existing.fullName || fullName,
          email: existing.email ?? email,
          phone: existing.phone || phone,
        },
      });
    }

    return this.prisma.customer.create({
      data: {
        fullName,
        email,
        phone,
        companyName: '',
      },
    });
  }

  private async syncFromOrders() {
    const orders = await this.prisma.order.findMany({
      where: { customerId: null },
      orderBy: { createdAt: 'asc' },
    });

    for (const order of orders) {
      const customer = await this.upsertFromReservation({
        fullName: order.customerName,
        email: order.email,
        phone: order.phone,
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { customerId: customer.id },
      });
    }
  }

  private async findByEmailOrPhone(email: string | null, phone: string) {
    return this.prisma.customer.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          { phone },
        ],
      },
    });
  }

  private async ensureExists(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  private cleanOptional(value?: string | null) {
    const cleaned = value?.trim();
    return cleaned ? cleaned : null;
  }

  private throwDuplicateError(error: unknown): never | void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BadRequestException('Customer email or phone already exists');
    }
  }
}

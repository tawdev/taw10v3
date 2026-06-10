import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findAll() {
    return this.prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateTeamMemberDto) {
    await this.ensureSortOrderAvailable(dto.sortOrder);
    return this.prisma.teamMember.create({ data: this.toCreateData(dto) });
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    await this.ensureExists(id);
    if (dto.sortOrder) await this.ensureSortOrderAvailable(dto.sortOrder, id);
    return this.prisma.teamMember.update({ where: { id }, data: this.toUpdateData(dto) });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.teamMember.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const member = await this.prisma.teamMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  private async ensureSortOrderAvailable(sortOrder: number, ignoreId?: string) {
    const existing = await this.prisma.teamMember.findUnique({ where: { sortOrder } });
    if (existing && existing.id !== ignoreId) {
      throw new BadRequestException('Duplicate team member sort orders are not allowed');
    }
  }

  private toCreateData(dto: CreateTeamMemberDto) {
    return {
      name_fr: dto.name_fr.trim(),
      name_en: dto.name_en.trim(),
      name_ar: dto.name_ar.trim(),
      role_fr: dto.role_fr.trim(),
      role_en: dto.role_en.trim(),
      role_ar: dto.role_ar.trim(),
      description_fr: dto.description_fr.trim(),
      description_en: dto.description_en.trim(),
      description_ar: dto.description_ar.trim(),
      imageUrl: dto.imageUrl.trim(),
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
    };
  }

  private toUpdateData(dto: UpdateTeamMemberDto) {
    return {
      name_fr: dto.name_fr?.trim(),
      name_en: dto.name_en?.trim(),
      name_ar: dto.name_ar?.trim(),
      role_fr: dto.role_fr?.trim(),
      role_en: dto.role_en?.trim(),
      role_ar: dto.role_ar?.trim(),
      description_fr: dto.description_fr?.trim(),
      description_en: dto.description_en?.trim(),
      description_ar: dto.description_ar?.trim(),
      imageUrl: dto.imageUrl?.trim(),
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
    };
  }
}

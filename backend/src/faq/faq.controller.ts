import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqReactionDto } from './dto/faq-reaction.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';

@ApiTags('FAQ')
@Controller('faq')
export class PublicFaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  findPublic() {
    return this.faqService.findPublic();
  }

  @Post(':id/reaction')
  react(@Param('id') id: string, @Body() dto: FaqReactionDto) {
    return this.faqService.react(id, dto);
  }
}

@ApiTags('Admin FAQ')
@ApiBearerAuth()
@Controller('admin/faq')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminFaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  @Post()
  create(@Body() dto: CreateFaqDto) {
    return this.faqService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}

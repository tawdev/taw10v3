import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from '../users/users.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('dashboard')
  dashboard() {
    return {
      platform: 'TAW10',
      status: 'ready',
    };
  }

  @Get('users')
  users() {
    return this.usersService.listAdmins();
  }

  @Get('settings')
  settings() {
    return {
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
      registration: 'disabled',
    };
  }
}

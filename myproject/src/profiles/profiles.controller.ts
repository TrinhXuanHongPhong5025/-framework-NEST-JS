import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  list() {
    return this.profilesService.list();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfileDto,
  ) {
    return this.profilesService.update(id, body);
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProfileOverride } from './profile-override.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileOverride]), AuthModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Artifact } from './artifact.entity';
import { ArtifactsController } from './artifacts.controller';
import { ArtifactsService } from './artifacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Artifact]), AuthModule],
  controllers: [ArtifactsController],
  providers: [ArtifactsService],
})
export class ArtifactsModule {}
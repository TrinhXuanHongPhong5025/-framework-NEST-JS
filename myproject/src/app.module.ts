import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ArtifactsModule } from './artifacts/artifacts.module';
import { Artifact } from './artifacts/artifact.entity';
import { ProfileOverride } from './profiles/profile-override.entity';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'security.db',
      entities: [User, Artifact, ProfileOverride],
      synchronize: true,
    }),

    AuthModule,
    ArtifactsModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
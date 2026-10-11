import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileOverride } from './profile-override.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(ProfileOverride)
    private readonly profileRepository: Repository<ProfileOverride>,
  ) {}

  list() {
    return this.profileRepository.find();
  }

  async update(id: number, changes: UpdateProfileDto) {
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new BadRequestException('Mã hồ sơ không hợp lệ');
    }

    const existing = await this.profileRepository.findOneBy({ id });
    const profile = this.profileRepository.create({
      ...(existing ?? {}),
      ...changes,
      id,
    });
    this.validate(profile);
    return this.profileRepository.save(profile);
  }

  private validate(profile: Partial<ProfileOverride>) {
    const requiredFields: Array<keyof ProfileOverride> = [
      'name', 'email', 'phone', 'website', 'companyName', 'street', 'city',
    ];
    for (const field of requiredFields) {
      const value = profile[field];
      if (typeof value !== 'string' || !value.trim()) {
        throw new BadRequestException('Các thông tin hồ sơ không được để trống');
      }
    }
    if (typeof profile.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      throw new BadRequestException('Email không hợp lệ');
    }
    if (profile.imageData && (
      !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(profile.imageData)
      || profile.imageData.length > 3_000_000
    )) {
      throw new BadRequestException('Ảnh hồ sơ không hợp lệ hoặc vượt quá 2 MB');
    }
  }
}
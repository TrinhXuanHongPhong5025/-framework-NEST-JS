import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileOverride } from './profile-override.entity';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  const profileRepository = {
    create: jest.fn((profile) => profile),
    find: jest.fn().mockResolvedValue([]),
    findOneBy: jest.fn().mockResolvedValue(null),
    save: jest.fn(async (profile) => profile),
  };
  const profile = {
    name: 'Casey Example',
    email: 'casey@example.com',
    phone: '555-0100',
    website: 'casey.example.com',
    companyName: 'Example Co.',
    street: 'Main St',
    city: 'Example City',
    imageData: null,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: getRepositoryToken(ProfileOverride), useValue: profileRepository },
      ],
    }).compile();
    service = module.get(ProfilesService);
  });

  it('lists stored profile overrides', async () => {
    await service.list();
    expect(profileRepository.find).toHaveBeenCalled();
  });

  it('persists a valid profile override', async () => {
    await service.update(3, profile);
    expect(profileRepository.create).toHaveBeenCalledWith({ ...profile, id: 3 });
    expect(profileRepository.save).toHaveBeenCalled();
  });

  it('rejects invalid profile email', async () => {
    await expect(service.update(3, { ...profile, email: 'invalid' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });
});
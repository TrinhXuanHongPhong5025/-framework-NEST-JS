import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artifact, ArtifactCategory } from './artifact.entity';
import { ArtifactsService } from './artifacts.service';

describe('ArtifactsService', () => {
  let service: ArtifactsService;
  const artifactRepository = {
    create: jest.fn((artifact) => artifact),
    find: jest.fn().mockResolvedValue([]),
    findOneBy: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(async (artifact) => ({ id: 1, ...artifact })),
  };
  const validArtifact = {
    title: 'Bronze bell',
    category: ArtifactCategory.ARTIFACT,
    imageData: `data:image/png;base64,${'a'.repeat(40)}`,
    description: 'A historic bronze bell.',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtifactsService,
        { provide: getRepositoryToken(Artifact), useValue: artifactRepository },
      ],
    }).compile();
    service = module.get(ArtifactsService);
  });

  it('lists artifacts newest first', async () => {
    await service.list();
    expect(artifactRepository.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
  });

  it('creates a valid artifact', async () => {
    await service.create(validArtifact);
    expect(artifactRepository.create).toHaveBeenCalledWith(validArtifact);
    expect(artifactRepository.save).toHaveBeenCalled();
  });

  it('rejects unsupported image data', async () => {
    await expect(service.create({ ...validArtifact, imageData: 'not-an-image' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects malformed artifact fields', async () => {
    await expect(service.create({ ...validArtifact, title: 42 as unknown as string }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates an existing artifact', async () => {
    const existingArtifact = { id: 1, ...validArtifact } as Artifact;
    artifactRepository.findOneBy.mockResolvedValueOnce(existingArtifact);
    await service.update(1, { title: 'Updated bell' });
    expect(artifactRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated bell' }),
    );
  });

  it('rejects deleting a missing artifact', async () => {
    artifactRepository.findOneBy.mockResolvedValueOnce(null);
    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artifact, ArtifactCategory } from './artifact.entity';
import { CreateArtifactDto } from './dto/create-artifact.dto';
import { UpdateArtifactDto } from './dto/update-artifact.dto';

@Injectable()
export class ArtifactsService {
  constructor(
    @InjectRepository(Artifact)
    private readonly artifactRepository: Repository<Artifact>,
  ) {}

  list() {
    return this.artifactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const artifact = await this.artifactRepository.findOneBy({ id });
    if (!artifact) throw new NotFoundException('Không tìm thấy hiện vật');
    return artifact;
  }

  async create(data: CreateArtifactDto) {
    this.validate(data);
    const artifact = this.artifactRepository.create({
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
    });
    return this.artifactRepository.save(artifact);
  }

  async update(id: number, data: UpdateArtifactDto) {
    const artifact = await this.findOne(id);
    this.validate({
      title: data.title ?? artifact.title,
      category: data.category ?? artifact.category,
      imageData: data.imageData ?? artifact.imageData,
      description: data.description ?? artifact.description,
    });
    Object.assign(artifact, data);
    if (data.title !== undefined) artifact.title = data.title.trim();
    if (data.description !== undefined) artifact.description = data.description.trim();
    return this.artifactRepository.save(artifact);
  }

  async remove(id: number) {
    const artifact = await this.findOne(id);
    await this.artifactRepository.remove(artifact);
    return { id };
  }

  private validate(data: CreateArtifactDto) {
    if (typeof data.title !== 'string' || !data.title.trim() || data.title.trim().length > 150) {
      throw new BadRequestException('Tên hiện vật không được để trống và tối đa 150 ký tự');
    }
    if (!Object.values(ArtifactCategory).includes(data.category)) {
      throw new BadRequestException('Loại hiện vật không hợp lệ');
    }
    if (typeof data.imageData !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(data.imageData) || data.imageData.length > 3_000_000) {
      throw new BadRequestException('Ảnh không hợp lệ hoặc vượt quá 2 MB');
    }
    if (typeof data.description !== 'string' || data.description.trim().length > 5000) {
      throw new BadRequestException('Mô tả tối đa 5000 ký tự');
    }
  }
}
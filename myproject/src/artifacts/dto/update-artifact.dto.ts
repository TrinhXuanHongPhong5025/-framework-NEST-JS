import { ArtifactCategory } from '../artifact.entity';

export class UpdateArtifactDto {
  title?: string;
  category?: ArtifactCategory;
  imageData?: string;
  description?: string;
}
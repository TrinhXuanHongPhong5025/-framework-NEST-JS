import { ArtifactCategory } from '../artifact.entity';

export class CreateArtifactDto {
  title: string;
  category: ArtifactCategory;
  imageData: string;
  description: string;
}
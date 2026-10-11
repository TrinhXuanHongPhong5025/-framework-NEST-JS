import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ArtifactCategory {
  HOT_HIT = 'hot-hit',
  ARTIFACT = 'artifact',
}

@Entity('artifacts')
export class Artifact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'varchar', length: 20 })
  category: ArtifactCategory;

  @Column({ type: 'text' })
  imageData: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
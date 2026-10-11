import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profile_overrides')
export class ProfileOverride {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 254 })
  email: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 200 })
  website: string;

  @Column({ length: 150 })
  companyName: string;

  @Column({ length: 150 })
  street: string;

  @Column({ length: 100 })
  city: string;

  @Column({ type: 'text', nullable: true })
  imageData: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
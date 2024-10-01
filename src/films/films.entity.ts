import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FilmsRating } from 'filmRating/filmsRating.entity';
@Entity()
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' }) createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' }) updatedAt?: Date;

  @Column({ nullable: false, unique: true }) name: string;

  @Column({ nullable: true }) description: string;

  @Column({ select: false, nullable: true }) releaseDate: string;

  @Column({ default: 0 }) ticketPrice: number;

  @Column() country: string;

  @Column() genre: string;

  @Column() photo: string;

  @OneToMany(() => FilmsRating, (rating) => rating.film)
  ratings: FilmsRating[];
}

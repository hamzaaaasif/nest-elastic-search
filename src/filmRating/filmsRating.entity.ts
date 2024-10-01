import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from '../films/films.entity';

@Entity()
export class FilmsRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' }) createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' }) updatedAt?: Date;

  @Column() rating: number;

  @Column({ nullable: true }) comment: string;

  @ManyToOne(() => Film, (film) => film.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  film: Film;
}

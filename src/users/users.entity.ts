import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { hash } from 'bcryptjs';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' }) createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' }) updatedAt?: Date;

  @Column({ nullable: true }) name: string;

  @Column({ unique: true }) email: string;

  @Column({ select: false, nullable: true }) password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}

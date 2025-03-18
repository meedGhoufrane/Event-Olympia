// event_olympia_backend/src/modules/users/entities/user.entity.ts
import { Schema, Document } from 'mongoose';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  resetTokenExpiration?: Date;
}


export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  role: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
}

export const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: 'user' },
  resetToken: { type: String, required: false },
  resetTokenExpiration: { type: Date, required: false },
});
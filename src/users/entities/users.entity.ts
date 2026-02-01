import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}

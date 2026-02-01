import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { UserModel } from './user.entity';
import { TagModel } from './tag.entity';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserModel, (user: UserModel) => user.posts)
  author: UserModel;

  @ManyToMany(() => TagModel, (tag: TagModel) => tag.posts)
  @JoinTable()
  tags: TagModel[];
}

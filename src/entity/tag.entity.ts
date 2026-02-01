import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PostModel } from './post.entity';

@Entity()
export class TagModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => PostModel, (post: PostModel) => post.tags)
  posts: PostModel[];
}

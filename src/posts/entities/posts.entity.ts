import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class PostsModel extends BaseEntity {
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: UsersModel;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}

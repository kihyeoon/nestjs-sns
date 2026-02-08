import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class PostsModel extends BaseEntity {
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: UsersModel;

  @Column()
  @IsString({ message: 'title은 string 타입이어야 합니다.' })
  @IsNotEmpty({ message: 'title은 비어있을 수 없습니다.' })
  title: string;

  @Column()
  @IsString({ message: 'content은 string 타입이어야 합니다.' })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}

import { RolesEnum } from 'src/users/const/roles.const';
import { Entity, Column, OneToMany } from 'typeorm';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class UsersModel extends BaseEntity {
  @Column({ unique: true, length: 20 })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}

import { IsEmail, IsString, Length } from 'class-validator';
import { RolesEnum } from 'src/users/const/roles.const';
import { Entity, Column, OneToMany } from 'typeorm';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class UsersModel extends BaseEntity {
  @Column({ unique: true, length: 20 })
  @IsString()
  @Length(1, 20)
  nickname: string;

  @Column({ unique: true })
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(3, 8)
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}

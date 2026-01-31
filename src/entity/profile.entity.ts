import { UserModel } from 'src/entity/user.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserModel, (user: UserModel) => user.profile)
  @JoinColumn()
  user: UserModel;
}

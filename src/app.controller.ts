import { Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './entity/user.entity';

@Controller()
export class AppController {
  constructor(@InjectRepository(UserModel) private userRepository: Repository<UserModel>) {}

  @Get('users')
  async getUsers() {
    return this.userRepository.find();
  }

  @Post('user')
  async postUser() {
    return this.userRepository.save({
      title: 'test',
    });
  }

  @Patch('user/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save({
      ...user,
      title: user.title + '0',
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { ImageModel } from 'src/common/entity/image.entity';
import { CreatePostImageDto } from './dto/create-image.dto';
import { join } from 'node:path';
import { TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { promises } from 'node:fs';
import { basename } from 'node:path';
import { POSTS_IMAGE_PATH } from 'src/common/const/path.const';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PostsImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(ImageModel) : this.imageRepository;
  }

  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempFilePath);
    } catch {
      throw new BadRequestException('존재하지 않는 파일입니다.');
    }

    const fileName = basename(tempFilePath);

    // 새로 이동할 포스트 폴더의 경로
    const newPath = join(POSTS_IMAGE_PATH, fileName);

    const result = await repository.save({
      ...dto,
    });

    await promises.rename(tempFilePath, newPath);

    return result;
  }
}

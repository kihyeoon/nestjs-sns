import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource } from 'typeorm';
import { PostsImagesService } from './image/images.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly imagesService: PostsImagesService,
    private readonly datasource: DataSource,
  ) {}

  @Get()
  async getPosts(@Query() paginatePostDto: PaginatePostDto) {
    return this.postsService.paginatePosts(paginatePostDto);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  generatePosts(@User('id') userId: number) {
    return this.postsService.generatePosts(userId);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(@User('id') userId: number, @Body() body: CreatePostDto) {
    const qr = this.datasource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const post = await this.postsService.createPost(userId, body, qr);

      if (body.images?.length) {
        for (let i = 0; i < body.images.length; i++) {
          await this.imagesService.createPostImage(
            {
              post,
              order: i,
              path: body.images[i],
              type: ImageModelType.POST_IMAGE,
            },
            qr,
          );
        }
      }

      await qr.commitTransaction();

      return this.postsService.getPostById(post.id);
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  @Put(':id')
  updatePost(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Patch(':id')
  patchPost(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.patchPost(id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}

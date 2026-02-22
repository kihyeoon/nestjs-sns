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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
    const post = await this.postsService.createPost(userId, body);

    if (body.images?.length) {
      for (let i = 0; i < body.images.length; i++) {
        await this.postsService.createPostImage({
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        });
      }
    }
    return this.postsService.getPostById(post.id);
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

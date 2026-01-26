import { Controller, Get, Param, Post, Body, Put, Patch, Delete } from '@nestjs/common';
import type { PostModel } from './posts.service';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string): PostModel {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostModel {
    return this.postsService.createPost(author, title, content);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() post: PostModel): PostModel {
    return this.postsService.updatePost(Number(id), post);
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ): PostModel {
    return this.postsService.patchPost(Number(id), author, title, content);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): { message: string } {
    this.postsService.deletePost(Number(id));
    return { message: 'Post deleted successfully' };
  }
}

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

const posts: PostModel[] = [
  {
    id: 1,
    author: 'author1',
    title: 'title1',
    content: 'content1',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: 'author2',
    title: 'title2',
    content: 'content2',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 3,
    author: 'author3',
    title: 'title3',
    content: 'content3',
    likeCount: 0,
    commentCount: 0,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  // 1) GET /posts
  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  // 2) GET /posts/:id
  @Get(':id')
  getPostById(@Param('id') id: string) {
    const post = posts.find((post) => post.id === Number(id));
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  // 3) POST /posts
  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts.push(post);
    return post;
  }

  // 4) PUT /posts/:id
  @Put(':id')
  updatePost(@Param('id') id: string, @Body() post: PostModel) {
    const postIndex = posts.findIndex((post) => post.id === Number(id));
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }
    posts[postIndex] = post;
    return posts[postIndex];
  }

  // 5) PATCH /posts/:id
  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    const post = posts.find((post) => post.id === Number(id));
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    posts.splice(posts.indexOf(post), 1, post);

    return post;
  }

  // 6) DELETE /posts/:id
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const postIndex = posts.findIndex((post) => post.id === Number(id));
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }
    posts.splice(postIndex, 1);
    return { message: 'Post deleted successfully' };
  }
}

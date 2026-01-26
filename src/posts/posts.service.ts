import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  private posts: PostModel[] = [
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

  async getAllPosts() {
    return this.postsRepository.find();
  }

  getPostById(id: number): PostModel {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  createPost(author: string, title: string, content: string): PostModel {
    const post: PostModel = {
      id: this.posts[this.posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    this.posts.push(post);
    return post;
  }

  updatePost(id: number, post: PostModel): PostModel {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }
    this.posts[postIndex] = post;
    return this.posts[postIndex];
  }

  patchPost(id: number, author?: string, title?: string, content?: string): PostModel {
    const post = this.posts.find((p) => p.id === id);
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

    return post;
  }

  deletePost(id: number): void {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }
    this.posts.splice(postIndex, 1);
  }
}

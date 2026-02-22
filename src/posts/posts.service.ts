import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsModel } from './entities/posts.entity';
import { DEFAULT_FIND_OPTIONS } from './const/default-find-options.const';

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
    private readonly commonService: CommonService,
  ) {}

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({ ...DEFAULT_FIND_OPTIONS, where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(dto, this.postsRepository, DEFAULT_FIND_OPTIONS, 'posts');
  }

  async generatePosts(authorId: number) {
    const posts = Array.from({ length: 100 }, (_, i) =>
      this.postsRepository.create({
        author: { id: authorId },
        title: `임의 포스트 ${i + 1}`,
        content: `임의로 생성된 포스트 내용 ${i + 1}`,
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
      }),
    );

    return this.postsRepository.save(posts);
  }

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(PostsModel) : this.postsRepository;
  }

  async createPost(authorId: number, createPostDto: CreatePostDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const post = repository.create({
      author: { id: authorId },
      ...createPostDto,
      images: [],
      likeCount: 0,
      commentCount: 0,
    });

    return await repository.save(post);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const existingPost = await this.postsRepository.findOne({ where: { id } });
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }
    const postDto: Omit<UpdatePostDto, 'images'> = updatePostDto;
    Object.assign(existingPost, postDto);

    return await this.postsRepository.save(existingPost);
  }

  async patchPost(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const postDto: Omit<UpdatePostDto, 'images'> = updatePostDto;
    Object.assign(post, postDto);

    return await this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
    return id;
  }
}

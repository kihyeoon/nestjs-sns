import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { BaseEntity } from './entity/base.entity';
import { ConfigService } from '@nestjs/config';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { ENV_HOST_KEY, ENV_PORT_KEY, ENV_PROTOCOL_KEY } from './const/env-keys.const';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  paginate<T extends BaseEntity>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseEntity>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    if (!dto.page) {
      throw new BadRequestException('Page number is required');
    }

    const { where, order } = this.composeFindOptions<T>(dto);

    const [data, total] = await repository.findAndCount({
      ...overrideFindOptions,
      where,
      order,
      skip: (dto.page - 1) * dto.take,
      take: dto.take,
    });

    return {
      data,
      total,
    };
  }

  private async cursorPaginate<T extends BaseEntity>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const { where, order } = this.composeFindOptions<T>(dto);

    const data = await repository.find({
      ...overrideFindOptions,
      where,
      order,
      take: dto.take,
    });

    const lastId = data.length > 0 ? data[data.length - 1].id : null;

    let nextUrl: string | null = null;

    if (data.length === dto.take) {
      nextUrl = this.buildNextUrl(dto, path, lastId!);
    }

    return {
      data,
      cursor: {
        after: lastId,
      },
      count: data.length,
      next: nextUrl,
    };
  }

  private composeFindOptions<T extends BaseEntity>(dto: BasePaginationDto) {
    const where = {} as FindOptionsWhere<T>;
    const order = {} as FindOptionsOrder<T>;

    for (const [key, value] of Object.entries(dto)) {
      if (value === undefined) {continue;}

      if (key.startsWith('where__')) {
        const { field, parsedValue } = this.parseWhereFilter(key, value);
        (where as Record<string, unknown>)[field] = parsedValue;
      } else if (key.startsWith('order__')) {
        const field = key.split('__')[1];
        (order as Record<string, unknown>)[field] = value;
      }
    }

    return { where, order };
  }

  private parseWhereFilter(
    key: string,
    value: unknown,
  ): { field: string; parsedValue: unknown } {
    const parts = key.split('__');
    // parts[0] = 'where', parts[1] = field, parts[2] = operator (optional)
    const field = parts[1];

    if (parts.length === 2) {
      return { field, parsedValue: value };
    }

    const operator = parts[2];

    const operatorMap: Record<string, (v: unknown) => unknown> = {
      more_than: (v) => MoreThan(v),
      less_than: (v) => LessThan(v),
    };

    const mapFn = operatorMap[operator];
    if (!mapFn) {
      return { field, parsedValue: value };
    }

    return { field, parsedValue: mapFn(value) };
  }

  private buildNextUrl(
    dto: BasePaginationDto,
    path: string,
    lastId: number,
  ): string {
    const protocol = this.configService.getOrThrow<string>(ENV_PROTOCOL_KEY);
    const host = this.configService.getOrThrow<string>(ENV_HOST_KEY);
    const port = this.configService.getOrThrow<string>(ENV_PORT_KEY);

    const url = new URL(`${protocol}://${host}:${port}/${path}`);

    for (const [key, value] of Object.entries(dto)) {
      if (value === undefined || key === 'page') {continue;}

      if (key.startsWith('where__')) {
        const parts = key.split('__');
        const operator = parts[2];

        if (operator === 'more_than' || operator === 'less_than') {
          url.searchParams.set(key, lastId.toString());
        } else {
          url.searchParams.set(key, String(value));
        }
      } else if (key.startsWith('order__')) {
        url.searchParams.set(key, String(value));
      }
    }

    url.searchParams.set('take', dto.take.toString());

    return url.toString();
  }
}

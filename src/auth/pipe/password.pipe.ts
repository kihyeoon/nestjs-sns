import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly minLength: number) {}

  transform(value: string) {
    if (value.length < this.minLength) {
      throw new BadRequestException(`비밀번호는 ${this.minLength}자 이상이어야 합니다.`);
    }

    return value;
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly maxLength: number) {}

  transform(value: string) {
    if (value.length > this.maxLength) {
      throw new BadRequestException(`비밀번호는 ${this.maxLength}자 이하여야 합니다.`);
    }

    return value;
  }
}

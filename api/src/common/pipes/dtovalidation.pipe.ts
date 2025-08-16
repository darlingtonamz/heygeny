import {PipeTransform, Injectable, BadRequestException} from '@nestjs/common';
import {validate} from 'class-validator';
import {ClassConstructor, plainToClass} from 'class-transformer';

@Injectable()
export class DTOValidationPipe implements PipeTransform<unknown> {
  constructor(private readonly dto: ClassConstructor<object>) {}

  async transform(value: unknown): Promise<unknown> {
    const object = plainToClass(this.dto, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return value;
  }
}
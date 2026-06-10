import { IsIn } from 'class-validator';

export class FaqReactionDto {
  @IsIn(['like', 'dislike'])
  type!: 'like' | 'dislike';
}

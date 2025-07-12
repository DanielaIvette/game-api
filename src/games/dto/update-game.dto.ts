import { IsOptional, IsString, IsObject, IsInt } from 'class-validator';

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  playerName?: string;

  @IsOptional()
  @IsObject()
  score?: Record<string, number>;

@IsOptional()
@IsInt()
userId?: number;
}
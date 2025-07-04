import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  playerName?: string;

  @IsOptional()
  @IsObject()
  score?: Record<string, number>;
}

import { IsArray, IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, isString, IsString, Min } from "class-validator";
import { IsIn } from "sequelize-typescript";

export enum GameState {
WAITING = 'waiting',
IN_PROGRESS = 'in_progress',
FINISHED = 'finished',
}

export class CreateGameDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(2)
    maxPlayers: number;

    @IsInt()
    @IsOptional()
    userId?: number;

    @IsEnum(GameState)
    @IsOptional()
    state?: GameState;

    @IsObject()
    @IsOptional()
    score?: Record<string, number>;
} 
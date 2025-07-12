import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { GamePlayer } from 'src/games/entities/game-player.entity';
import { Game } from 'src/games/entities/game.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Game, GamePlayer])],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { GamePlayer } from './entities/game-player.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [ SequelizeModule.forFeature([Game, GamePlayer, User]), UsersModule],
})
export class GameModule {}

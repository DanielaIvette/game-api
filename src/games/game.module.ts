import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [ SequelizeModule.forFeature([Game])],
})
export class GameModule {}

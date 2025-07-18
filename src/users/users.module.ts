import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { GamePlayer } from 'src/games/entities/game-player.entity';
import { Game } from 'src/games/entities/game.entity';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  imports: [
    ConfigModule, 
    SequelizeModule.forFeature([User, Game, GamePlayer]), 
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: {expiresIn: '3h'}
    })
  })],
  exports: [UsersService, JwtModule, SequelizeModule, PassportModule, JwtStrategy],
})
export class UsersModule {}

import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateGameDto, GameState} from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GamePlayer } from './entities/game-player.entity';
import { SimpleUser } from './entities/types';

@Injectable()
export class GameService {
    private readonly logger = new Logger('GamesService');

constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
    @InjectModel(User)
    private userModel: typeof User,
    private readonly userService: UsersService,
      @InjectModel(GamePlayer)
  private gamePlayerModel: typeof GamePlayer,
) {}

    async create(createGameDto: CreateGameDto) {
        const { name, maxPlayers, userId, state } = createGameDto;
 try {
    const newGame = await this.gameModel.create({
        name: name,
        maxPlayers: maxPlayers,
        state: state, // 'waiting',
        score: null,
    });

if (userId){
const user = await this.userService.findOne(userId);
await newGame.$add('players', user);
    
await this.gamePlayerModel.create({
    gameId: newGame.id,
    userId: user.id,
    status: 'waiting',
  });
}

    return newGame;
        } catch (error) {
            this.handleDBException(error);
        }
    }
async findAll() {
    const users = await this.userModel.findAll();
    return users;
}

    async findOne(id: number) {
        const game = await this.gameModel.findOne({
            where: {
                id: id,
            },
            include: [
                {
                model: User,
                as: 'players',
                attributes: ['id', 'fullname', 'email'],
                through: { attributes: [],}
            },
    ],
        });
        
        if (!game) {
            throw new BadRequestException(`Game with id: ${id} not found`);
        }
            
        return game;
    }

async joinGame(gameId: number, updateGameDto: UpdateGameDto) {
    const { userId } = updateGameDto;

    if(!userId) throw new BadRequestException('User ID is required too join the game')

    const game = await this.findOne(gameId);

    if (game.state !== GameState.WAITING) throw new BadRequestException('Game is full');

    const user = await this.userService.findOne(userId);

const alreadyJoined = game.players.find(
    (player) => player.id === userId,
);
    if (alreadyJoined) 
        throw new BadRequestException ('User already joined the game');

    if(game.players.length >= game.maxPlayers) 
        throw new BadRequestException('Game is full');

    await game.$add('players', user);

  return {
    message: `User ${user.fullname} has joined the game ${game.name}`,
  };
}

async startGame(id: number) {
    const game = await this.findOne(id);

    try {
await game.update({
state: GameState.IN_PROGRESS,
});

return {
    message: 'The game has been started',
};
    } catch (error) {
        this.handleDBException(error);
    }
}

async endGame(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);
    

    try {
await game.update({
    score: updateGameDto.score,
    state: GameState.FINISHED,
});

return {
    message: 'Game finished',
};
    } catch (error) {
    this.handleDBException(error);
}
}

private handleDBException(error: any) {
    if(error.parent.code === '23505'){
        throw new BadRequestException(error.parent.detail);
    }
    
this.logger.error(error)
throw new InternalServerErrorException ('Something went very wrong!');
}

async getUsersStatusByGame(gameId: number) {
  try {
    const playerStatuses = await this.gamePlayerModel.findAll({
      where: { gameId },
      include: [
        {
          model: User,
          attributes: ['id', 'fullname', 'email'],
          required: true, 
        },
      ],
    });
    console.log('📦 playerStatuses:', JSON.stringify(playerStatuses, null, 2));

    const groupedByStatus: { [key: string]: SimpleUser[] } = {
  waiting: [],
  in_progress: [],
  finished: [],
};

for (const record of playerStatuses) {
  const user = record.user;
  if (!user) continue;

  const userInfo: SimpleUser = {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
  };

  const key = record.status?.trim();

  if (groupedByStatus[key]) {
    console.log(`🎯 Pushing ${user.fullname} into "${key}" group`);
    groupedByStatus[key].push(userInfo);
  } else {
    console.warn(`🚧 No se reconoció status: "${key}"`);
  }
}
    return groupedByStatus;
  } catch (error) {
    console.error('Error en getUsersStatusByGame:', error);
    throw new InternalServerErrorException('Error obteniendo el estado de los jugadores');
  }
}
}
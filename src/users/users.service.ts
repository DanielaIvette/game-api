import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { where } from 'sequelize';
import { User } from './entities/user.entity';
import { Game } from 'src/games/entities/game.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectModel (User)
    private userModel: typeof User,
  ){}

  async create(createUserDto: CreateUserDto) {
    const {fullname, email, isActive_bool} = createUserDto;
    try {
const newUser = await this.userModel.create({
  fullname: fullname,
  email: email,
  isActive: true,
});

return newUser;
    } catch (error) {
      this.handleDBException(error);
    }
  }

 async findAll() {
  try {
    const users = await this.userModel.findAll({
      where: {
        isActive_bool: true,
      },
      include: [
        {
          model: Game,
          through: {
            attributes: [],
          },
        },
      ],
    });

    console.log('Usuarios encontrados:', users);
    return users;
  } catch (error) {
    console.error('Error en UsersService.findAll:');
    console.error('Nombre:', error.name);
    console.error('Mensaje:', error.message);
    console.error('Stack:\n', error.stack);
    throw error;
  }
}
  async findOne(id: number) {
    const user = await this.userModel.findOne({
      where: {
        id: id,
      },
    });
  if (!user) {
    throw new BadRequestException(`User with id: ${id} not found`);
  }
    return user;
}

  private handleDBException(error: any) {
      if(error.parent.code === '23505'){
          throw new BadRequestException (error.parent.detail);
      }
      
  this.logger.error(error)
  throw new InternalServerErrorException ('Something went very wrong!');
  }
}

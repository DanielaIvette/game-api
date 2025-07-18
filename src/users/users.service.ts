import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { where } from 'sequelize';
import { User } from './entities/user.entity';
import { Game } from 'src/games/entities/game.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './interfaces/user.role.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectModel (User)
    private userModel: typeof User,

    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    const {fullname, email, password } = createUserDto;
    try {
const newUser = await this.userModel.create({
  fullname: fullname,
  email: email,
  password: bcrypt.hashSync(password,12),
  rol: [UserRole.PLAYER],
  isActive: true,
});

return {
  message: 'User created successfully',
user: {
  fullname: newUser.dataValues.fullname,
  email: newUser.dataValues.email,
  id: newUser.dataValues.id,
},
};
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const {email, password} = loginUserDto;

    const user = await this.userModel.findOne({
      where: {
        email: email,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

      if (!bcrypt.compareSync(password, user.dataValues.password)) {
    throw new UnauthorizedException('Invalid password');
      }
    
    return {
      token: this.getJwtToken({
        id: user.dataValues.id,
      }),
      user: {
        id: user.dataValues.id,
        fullname: user.dataValues.fullname,
        email: user.dataValues.email,
      },
  };
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

private getJwtToken(payload: JwtPayload) {
  return this.jwtService.sign(payload);
} 

  private handleDBException(error: any) {
      if(error.parent.code === '23505'){
          throw new BadRequestException (error.parent.detail);
      }
      
  this.logger.error(error)
  throw new InternalServerErrorException ('Something went very wrong!');
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from './interfaces/user.role.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test-token')
  testToken(@Req() req) {
    console.log('✅ Usuario autenticado:', req.user);
    return req.user;
  }

  @Get()
  @Auth()
  async findAll() {
  try {
    return await this.usersService.findAll();
  } catch (error) {
    console.error('Error en findAll:', error);
    throw error;
  }
}

  @Get(':id')
  @Auth(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}

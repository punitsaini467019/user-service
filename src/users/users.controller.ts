import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw Error(error);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    try {
      return await this.usersService.login(loginUserDto);
    } catch (error) {
      throw Error(error);
    }
  }

  //apply guard for get all users;
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw Error(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

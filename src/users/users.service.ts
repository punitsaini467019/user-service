import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as response from '../../response';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, email } = createUserDto;
      const checkUser = await this.userRepository.query(
        `SELECT * FROM user where email = '${email}'`,
      );
      if (checkUser.length > 0) {
        // return response.apiResponse(400, false, 'email already register');
        return new NotAcceptableException(
          `email is already register`,
        ).getResponse();
      }
      const saltOrRounds = 10;
      if (password) {
        const hash = await bcrypt.hash(password, saltOrRounds);
        createUserDto.password = hash;
      } else {
        return response.apiResponse(400, false, 'password is empty');
      }
      const userData = await this.userRepository.save(createUserDto);
      return response.apiResponse(
        200,
        true,
        'user register successfully',
        userData,
      );
    } catch (error) {
      throw Error(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const checkUser = await this.userRepository.query(
        `SELECT * FROM user where email = '${email}'`,
      );
      if (checkUser.length === 0) {
        return new NotFoundException('user is not found').getResponse();
      }
      const checkPassword = await bcrypt.compare(
        password,
        checkUser[0].password,
      );
      if (!checkPassword) {
        return response.apiResponse(400, false, 'invalid password');
      }
      const payload = { sub: checkUser[0].id, email: checkUser[0].email };
      const genrateToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '120s',
      });
      checkUser[0].token = genrateToken;
      await this.userRepository.save(checkUser[0]);
      return response.apiResponse(200, true, 'user login successfully', {
        email,
        genrateToken,
      });
    } catch (error) {
      throw Error(error);
    }
  }

  async findAll() {
    try {
      const userData = await this.userRepository.find({
        select: { id: true, firstName: true, lastName: true, email: true },
      });
      return response.apiResponse(
        200,
        true,
        'get all user successfully',
        userData,
      );
    } catch (error) {
      throw Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

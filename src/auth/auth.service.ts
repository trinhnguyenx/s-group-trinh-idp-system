import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginCredentials, TokenDto } from './interface';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginCredentials> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const token = this.jwtService.sign({ id: user.id });
    console.log(user.id, token);
    const tokenDto: TokenDto = {
      type: 'Bearer',
      name: 'access_token',
      value: token,
    };
    const loginCredentials: LoginCredentials = {
      tokens: [tokenDto],
    };
    return loginCredentials;
  }
}
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {Ilogin} from './interfaces/login.interface';
import { PermissionService } from 'src/permission/permission.service';


@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
    private readonly permissionsService: PermissionService,


	) {}
	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.findOneByemail(email);
		if (user && bcrypt.compare(password, user.password)) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}


  async login(user: Ilogin) {
    const userFind = await this.userService.findOneByemail(user.email);
    if (!userFind) {
      throw UnauthorizedException;
    }
    console.log(userFind.roles);
		const userPermissions =
			await this.permissionsService.getPermissionByRolesName(
				userFind.roles.map((role) => role.name),
			);
    const payLoad = {
      id: userFind.id,
      email: userFind.email,
      username: userFind.username,
      sub: {
        fullname : userFind.fullname
      },
      permissions: userPermissions,

    };
    const { password, ...userWithoutPassword } = userFind;
    return {
      ...userWithoutPassword,
      access_token: await this.jwtService.signAsync(payLoad),
      refresh_token: await this.jwtService.signAsync(payLoad, {expiresIn: '7d'}),

    }

  }
  async refreshToken(token: string) {
    const payload = {
      token
    };

    return {
      access_token: await this.jwtService.signAsync(payload,{expiresIn: '365d'}),
    };
  }
}

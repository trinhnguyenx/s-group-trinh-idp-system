import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';


export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class CustomAuthGuard implements CanActivate {
    static extractTokenFromHeader(request: globalThis.Request) {
        throw new Error('Method not implemented.');
    }
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private readonly userService: UsersService,

    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
        if (isPublic) {
            // Nếu API được đánh dấu là public, bỏ qua xác thực
            return true;
        }
    
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Missing token');
        }
    
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log(roles);
        if (!roles) {
            throw new UnauthorizedException('Roles not defined for this route');
        }
    
        try {
            const user = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }
            const userF = await this.userService.findOneByemail(user.email);
            if (!userF) {
                throw new UnauthorizedException('User not found');
            }
    
            const roleStrings = userF.roles.map(role => role.name);
            if (!this.checkUserRoles(roleStrings, roles)) {
                throw new UnauthorizedException('Access denied');
            }
    
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
    

        public extractTokenFromHeader(request: Request): string | undefined {
            const [type, token] = request.headers.authorization?.split(' ') ?? [];
            return type === 'Bearer' ? token : undefined;
        }

    private checkUserRoles(userRoles: string[], requiredRoles: string[]): boolean {
        return userRoles.some(role => requiredRoles.includes(role));
    }
}

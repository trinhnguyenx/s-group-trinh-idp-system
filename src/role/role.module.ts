import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import{ CustomAuthGuard } from '../auth/guards/jwt-auth.guard'
import { JwtService } from '@nestjs/jwt';
@Module({
	imports: [UserModule,TypeOrmModule.forFeature([Role,User])],
	controllers: [RoleController],
	providers: [RoleService,UsersService,CustomAuthGuard, JwtService],
	exports: [RoleService]
})
export class RoleModule {}

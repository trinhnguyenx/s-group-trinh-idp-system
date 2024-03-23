import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthorzationDto } from './dto/create-authorzation.dto';
import { Author } from './entities/authorzation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthorzationService {
	constructor(
		@InjectRepository(Author)
		private readonly authorRepository: Repository<Author>,
		private readonly jwtService: JwtService,
		private readonly userService: UsersService,
	) {}

	async create(
		createAuthorzationDto: CreateAuthorzationDto,
		request: Request,
	): Promise<Author> {
		const existingCallback = await this.authorRepository.findOne({
			where: { URI_callback: createAuthorzationDto.URI_callback },
		});
		if (existingCallback) {
			throw new NotFoundException('URI already exists');
		}
		
		const authorization = new Author();
		const token = this.extractTokenFromHeader(request);
		if (token === undefined) {
			throw new UnauthorizedException('Missing token');
		}

		const verifiedToken = await this.jwtService.verifyAsync(await token, {
			secret: process.env.JWT_SECRET,
		});
		const user_id = Number((verifiedToken as { id: string }).id);
		authorization.user_id = user_id;
		if (!user_id) {
			throw new UnauthorizedException('Invalid token');
		}
		authorization.URI_callback = createAuthorzationDto.URI_callback;
		authorization.scope = createAuthorzationDto.scope;
		authorization.client_id = await this.jwtService.signAsync({ user_id},{expiresIn: '1h',secret: process.env.CLIENT_ID});
		authorization.secret_id = await this.jwtService.signAsync({ user_id},{expiresIn: '7d',secret: process.env.CLIENT_SECRET});

		return this.authorRepository.save(authorization);
	}
	async extractTokenFromHeader(request: Request): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve) => {
			const headers = request.headers as { authorization?: string };
			const [type, token] = headers.authorization?.split(' ') ?? [];
			resolve(type === 'Bearer' ? token : undefined);
		});
	}
	async findOneClientID(clientID: string): Promise<{ oauthData: Author | undefined, userData: User | undefined }> {
		const oauthData = await this.authorRepository.findOne({
			where: { client_id: clientID }
		});
	
		if (!oauthData) {
			return { oauthData: undefined, userData: undefined };
		}
		const userData = await this.userService.findOneByID(oauthData.user_id);
	
		return { oauthData, userData };
	}
	
	
}

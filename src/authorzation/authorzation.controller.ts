import { Controller,Body,Post,Req,UseGuards,Get,Request, Param } from '@nestjs/common';
import {AuthorzationService} from './authorzation.service';
import {CreateAuthorzationDto} from './dto/create-authorzation.dto';
import {UpdateAuthorzationDto} from './dto/update-authorzation.dto';
import { CustomAuthGuard, Public } from '../auth/guards/jwt-auth.guard';
import {IOauth} from '../auth/interfaces/oauth.interface';


@Controller('authorzation')
export class AuthorzationController {
    constructor(
        private authorzationService: AuthorzationService,
    ) {}

    @Public()
    @UseGuards(CustomAuthGuard)
    @Post()
    create(@Body() createauthorzation: CreateAuthorzationDto, @Req() request: Request) {
        return this.authorzationService.create(createauthorzation, request);
    }

    @Public()
    @Post('Oauth')
    findOne(@Request() req: IOauth) {
		return this.authorzationService.findOneClientID(req.client_id);
	}

    @Public()
    @Get('app')
    async loginRedirect(@Body() body: { client_id: string }): Promise<string> {
        const { client_id } = body;
        if (client_id) {
            console.log(client_id);
            return `http://localhost:4000/signIn?client_id=${client_id}`;
        } else {
            return 'Missing client_id';
        }
    }
    

}

import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorzationDto } from './create-authorzation.dto';

export class UpdateAuthorzationDto extends PartialType(CreateAuthorzationDto) {}

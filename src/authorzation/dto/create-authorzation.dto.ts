import { ApiProperty } from '@nestjs/swagger';
export class CreateAuthorzationDto {
	@ApiProperty()
	URI_callback: string;
    @ApiProperty()
    scope: string;
}

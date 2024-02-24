import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	console.log(process.env.JWT_SECRET);

	await app.listen(3000);
}
bootstrap();

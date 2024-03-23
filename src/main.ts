import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
dotenvConfig({ path: '.env' });

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
	app.use(cors());
  
	await app.listen(3000);
  }
  bootstrap();
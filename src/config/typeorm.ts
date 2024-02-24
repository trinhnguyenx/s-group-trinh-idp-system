import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

const config = {
	type: 'postgres',
	host: `${process.env.DB_HOST}`,
	port: `${process.env.DB_PORT}`,
	username: `${process.env.DB_USERNAME}`,
	password: `${process.env.DB_PASSWORD}`,
	database: `${process.env.DB_DATABASE}`,
	entities: ['dist/**/*.entity{.ts,.js}'],
	migrations: ['dist/migrations/*{.ts,.js}'],
	migrationsRun: true,
	autoLoadEntities: true,
	synchronize: false, // tham khảo
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

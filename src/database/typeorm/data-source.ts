import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import databaseConfig from '@config/database.config';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();
const dbConfig = databaseConfig();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.name,
  entities: [join(__dirname, '../../modules/*/domain/*.entity{.ts,.js}')],
  synchronize: false,
  logging: dbConfig.logging === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  bigNumberStrings: false,
});

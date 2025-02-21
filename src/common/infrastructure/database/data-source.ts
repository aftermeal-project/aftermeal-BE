import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import databaseConfig from '@config/database.config';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

dotenv.config();
const dbConfig = databaseConfig();

const options: MysqlConnectionOptions = {
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.name,
  entities: [join(__dirname, '../../../modules/*/domain/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: dbConfig.logging === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  bigNumberStrings: false,
  timezone: 'Z',
};

export const AppDataSource = new DataSource(options);

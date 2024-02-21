import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfiguration from '@config/database.config';

export class MysqlProvider implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfiguration.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfiguration>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const entityPath: string = join(
      __dirname,
      '../../**/domain/*.entity{.ts,.js}',
    );
    return {
      type: 'mysql',
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      username: this.dbConfig.user,
      password: this.dbConfig.password,
      database: this.dbConfig.name,
      entities: [entityPath],
      synchronize: true,
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
      bigNumberStrings: false,
    };
  }
}

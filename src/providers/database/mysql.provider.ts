import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfiguration from '@config/database.config';
import appConfiguration from '@config/app.config';

export class MysqlProvider implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfiguration.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfiguration>,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const entityPath: string = join(
      __dirname,
      '../../modules/**/domain/*.entity{.ts,.js}',
    );
    return {
      type: 'mysql',
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      username: this.dbConfig.user,
      password: this.dbConfig.password,
      database: this.dbConfig.name,
      entities: [entityPath],
      synchronize: this.appConfig.env === 'development',
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}

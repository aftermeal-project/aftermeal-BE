import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

/**
 * 테스트 MySQL 가져오기
 *
 * @returns {DynamicModule}
 */
export function getTestMysqlModule(): DynamicModule {
  return TypeOrmModule.forRootAsync({
    useFactory: () => {
      return {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'test',
        password: 'test',
        database: 'test',
        entities: [
          join(__dirname, '../..//src/modules/**/domain/*.entity{.ts,.js}'),
        ],
        synchronize: true,
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
      };
    },
    dataSourceFactory: async (options): Promise<DataSource> => {
      if (!options) {
        throw new Error('Invalid options passed');
      }
      return addTransactionalDataSource(new DataSource(options));
    },
  });
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfiguration from '@config/database.config';
import appConfiguration from '@config/app.config';
import { MysqlProvider } from './typeorm/mysql.provider';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [databaseConfiguration.KEY, appConfiguration.KEY],
      useClass: MysqlProvider,
      dataSourceFactory: async (options): Promise<DataSource> => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
})
export class DatabaseModule {}

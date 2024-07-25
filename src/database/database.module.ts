import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppDataSource } from './typeorm/data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
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

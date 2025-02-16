import { Global, Module } from '@nestjs/common';
import { WinstonLogger } from './winston.logger';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';

@Global()
@Module({
  providers: [
    {
      provide: WINSTON_LOGGER,
      useClass: WinstonLogger,
    },
  ],
  exports: [WINSTON_LOGGER],
})
export class LoggerModule {}

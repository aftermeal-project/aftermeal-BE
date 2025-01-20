import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from '@common/logger/winston-logger.service';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';

@Global()
@Module({
  providers: [
    {
      provide: WINSTON_LOGGER,
      useClass: WinstonLoggerService,
    },
  ],
  exports: [WINSTON_LOGGER],
})
export class LoggerModule {}

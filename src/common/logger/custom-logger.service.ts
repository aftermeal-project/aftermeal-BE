export interface CustomLoggerService {
  info(message: string): void;
  debug(message: string, context?: string): void;
  warn(message: string, context?: string): void;
  error(message: string, stack?: string, context?: string): void;
  setContext(context: string): void;
}

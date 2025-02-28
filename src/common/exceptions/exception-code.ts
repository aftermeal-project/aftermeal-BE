export enum ExceptionCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  NO_HANDLER = 'NO_HANDLER',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  ALREADY_EXIST_USER = 'ALREADY_EXIST_USER',
  ALREADY_EXIST_ACTIVITY_LOCATION = 'ALREADY_EXIST_ACTIVITY_LOCATION',
  ALREADY_PARTICIPATE_ACTIVITY = 'ALREADY_PARTICIPATE_ACTIVITY',
  EXCEED_MAX_PARTICIPANT = 'EXCEED_MAX_PARTICIPANT',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_SCHOOL_EMAIL = 'INVALID_SCHOOL_EMAIL',
  INVALID_SCHEDULED_DATE = 'INVALID_SCHEDULED_DATE',
  NOT_AVAILABLE_PARTICIPATE = 'NOT_AVAILABLE_PARTICIPATE',
  INVALID_EMAIL_VERIFICATION_CODE = 'INVALID_EMAIL_VERIFICATION_CODE',
  GRADUATED_GENERATION = 'GRADUATED_GENERATION',
  ACTIVITY_CREATION_CLOSED = 'ACTIVITY_CREATION_CLOSED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  MISSING_GENERATION = 'MISSING_GENERATION',
  FORBIDDEN = 'FORBIDDEN',
  PENDING_VERIFICATION_USER = 'PENDING_VERIFICATION_USER',
}

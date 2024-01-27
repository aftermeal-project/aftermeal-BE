import { generateRandomString } from '@common/utils/src/generate-random-string';

/**
 * Target is the user who will be invited.
 **/
export type Target = {
  userId: number;
};

/**
 * Context is the information that will be used for generating invitation.
 **/
export type Context = {
  /**
   * duration is the number of days that invitation will be valid.
   * numeric value of days;
   */
  duration: number;
  email: string;
};

export class Invitation {
  private static readonly INVITE_CODE_LENGTH = 32;
  public static readonly DEFAULT_EXPIRED_DAYS = 1;

  private constructor(
    readonly target: Target,
    readonly inviteeEmail: string,
    readonly expiresAt: Date,
    readonly code: string,
  ) {}

  static issue(target: Target, context: Context): Invitation {
    const now: Date = new Date();
    const expiresAt: Date = new Date(
      now.setDate(now.getDate() + context.duration),
    );

    const code: string = generateRandomString(this.INVITE_CODE_LENGTH);
    return new Invitation(target, context.email, expiresAt, code);
  }

  remainDuration(now: number): number {
    return this.expiresAt.getTime() - now;
  }
}

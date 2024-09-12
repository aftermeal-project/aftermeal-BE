import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class MockJwtAuthGuard {
  private shouldAllow = true;

  canActivate() {
    if (!this.shouldAllow) {
      throw new UnauthorizedException();
    }
    return this.shouldAllow;
  }

  setShouldAllow(value: boolean) {
    this.shouldAllow = value;
  }
}

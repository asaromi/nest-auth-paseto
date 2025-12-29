/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest()
      const [type, token] = (req?.headers?.authorization || '').split(' ') ?? []
      if (type !== 'Bearer') throw new UnauthorizedException('Invalid token type')
      else if (!token) throw new UnauthorizedException('Token not found')

      const payload = await this.authService.verifyToken(token, 'access')
      if (!payload || !payload.userId || !payload) throw new UnauthorizedException('Invalid token payload')

      req.user = payload
    } catch (error) {
      throw error instanceof Error ? error : new UnauthorizedException('Error while authenticating user')
    }

    return true
  }
}

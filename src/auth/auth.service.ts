/* eslint-disable @typescript-eslint/await-thenable */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { sign, verify } from 'paseto-ts/v4'
import * as dotenv from 'dotenv'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { AuthPayload } from '../model/auth.model'

dotenv.config()

@Injectable()
export class AuthService {
  private mode: string
  private privateKey: string
  private publicKey: string
  private issuer: string

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {
    this.mode = process.env.AUTH_MODE ?? ''
    this.privateKey = process.env.AUTH_PRIVATE_KEY ?? ''
    this.publicKey = process.env.AUTH_PUBLIC_KEY ?? ''
    this.issuer = process.env.AUTH_ISSUER ?? ''

    this.logger.info(
      `accessing AuthService: ${JSON.stringify({
        mode: this.mode,
        issuer: this.issuer,
        publicKey: this.publicKey,
        privateKey: this.privateKey,
      })}`,
    )
  }

  async signToken(payload: Record<string, any>, opts: { exp: string; type: 'access' | 'refresh' }): Promise<string> {
    try {
      if (!this.mode) throw new Error('Auth mode is not set')
      else if (!this.privateKey) throw new UnauthorizedException('Private key is not set')

      const { userId = '', username = '', roles = [] } = payload as AuthPayload
      if (!userId || !username) throw new UnauthorizedException('User id is not set')

      const token = await sign(
        this.privateKey,
        {
          userId,
          username,
          roles,
          type: opts.type,
          iss: this.issuer,
          exp: opts.exp,
        },
        { addIat: true, addExp: true },
      )
      if (!token) throw new UnauthorizedException('Failed to sign token')

      return token
    } catch (error) {
      throw error instanceof Error ? error : new UnauthorizedException('Failed to sign token')
    }
  }

  async verifyToken(token: string, type: 'access' | 'refresh'): Promise<AuthPayload> {
    try {
      if (!this.mode) throw new UnauthorizedException('Auth mode is not set')
      else if (!this.publicKey) throw new UnauthorizedException('Public key is not set')
      else if (!token) throw new UnauthorizedException('Token is not set')

      const { payload } = (await verify(this.publicKey, token)) as { payload: AuthPayload }
      if (!payload) throw new UnauthorizedException('Failed to verify token')
      else if (payload.type !== type) throw new UnauthorizedException('Invalid token type')

      return payload
    } catch (error) {
      throw error instanceof Error ? error : new UnauthorizedException('Failed to verify token')
    }
  }

  async createTokens(payload: Record<string, any>): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, { exp: '12h', type: 'access' }),
      this.signToken(payload, { exp: '30d', type: 'refresh' }),
    ])

    return { accessToken, refreshToken }
  }
}

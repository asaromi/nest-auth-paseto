import { Body, Controller, Get, Inject, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common'
import { AuthenticatedGuard } from '../auth/auth.guard'
import { ApiResponse } from '../model/api.model'
import { RegisterUserRequest, UserResponse } from '../model/user.model'
import { UserService } from './user.service'
import { Request } from 'express'
import { AuthPayload } from '../model/auth.model'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { User } from '@prisma/client'

@Controller('/api/users')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private userService: UserService,
  ) {}

  @Post('/')
  async register(@Body() request: RegisterUserRequest): Promise<ApiResponse<UserResponse>> {
    const result = await this.userService.register(request)

    return { data: result }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/me')
  getMe(@Req() request: Request & { user?: AuthPayload | User }): ApiResponse<AuthPayload | User> {
    if (!request.user) {
      throw new UnauthorizedException('User not found in request')
    }

    this.logger.info(`get user info ${JSON.stringify(request.user)}`)

    return { data: request.user }
  }
}

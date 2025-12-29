import { HttpException, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { HelperUtil } from '../common/helper.util'
import { PrismaService } from '../common/prisma.service'
import { ValidationService } from '../common/validation.service'
import { RegisterUserRequest, UserResponse } from '../model/user.model'
import { UserValidation } from './user.validation'

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`register new user ${JSON.stringify(request)}`)

    const registerRequest = this.validationService.validate(UserValidation.REGISTER, {
      ...request,
      id: HelperUtil.generateId(),
    } as RegisterUserRequest & { id: string })

    const totalUser = await this.prismaService.user.count({
      where: { username: registerRequest.username },
    })

    if (totalUser !== 0) {
      throw new HttpException('username already exists', 400)
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

    const user = await this.prismaService.user.create({
      data: registerRequest as RegisterUserRequest & { id: string },
    })

    return user as unknown as UserResponse
  }
}

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HelperUtil } from '../common/helper.util';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { LicenseRequest, LicenseResponse } from '../model/license.model';
import { LicenseValidation } from './license.validation';

@Injectable()
export class LicenseService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async create(request: LicenseRequest): Promise<LicenseResponse> {
    this.logger.info(`create new license ${JSON.stringify(request)}`);

    const licenseReq: LicenseRequest = this.validationService.validate(LicenseValidation.CREATE, {
      ...request,
      createdBy: 'system',
      id: HelperUtil.generateId(),
    });

    const licenseCounter = await this.prismaService.license.count({
      where: { code: licenseReq.code },
    });

    if (licenseCounter !== 0) {
      throw new HttpException('license already exists', 400);
    }

    const license = await this.prismaService.license.create({
      data: licenseReq as LicenseRequest & { createdBy: string; qty: number },
    });

    return license as unknown as LicenseResponse;
  }
}

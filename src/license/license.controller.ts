import { Body, Controller, Post } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseRequest, LicenseResponse } from '../model/license.model';
import { ApiResponse } from '../model/api.model';

@Controller('/api/licenses')
export class LicenseController {
  constructor(private licenseService: LicenseService) {}

  @Post('/')
  async createLicense(@Body() request: LicenseRequest): Promise<ApiResponse<LicenseResponse>> {
    const result = await this.licenseService.create(request);

    return { data: result };
  }
}

import { ProductLicense, User } from '@prisma/client';

export class LicenseRequest {
  id: string;
  code: string;
  qty: number | null;
  createdBy?: string;
}

export class LicenseResponse extends LicenseRequest {
  creator?: User;
  ProduceLicense?: ProductLicense[];
}

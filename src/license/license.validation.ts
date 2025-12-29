import { z, ZodType } from 'zod';
import { LicenseRequest } from '../model/license.model';

export class LicenseValidation {
  static readonly CREATE: ZodType<LicenseRequest> = z.object({
    id: z.ulid(),
    code: z.string().max(32),
    qty: z.int().min(1).nullable(),
    createdBy: z.string().max(26).optional(),
  });
}

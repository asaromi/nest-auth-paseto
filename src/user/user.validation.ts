import { z, ZodType } from 'zod';
import { RegisterUserRequest } from '../model/user.model';

export class UserValidation {
  static readonly REGISTER: ZodType<RegisterUserRequest> = z.object({
    id: z.ulid(),
    username: z.string().min(1).max(128),
    password: z.string().min(8),
    fullName: z.string().min(1).max(128),
  });
}

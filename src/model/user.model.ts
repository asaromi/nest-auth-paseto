export class LoginUserRequest {
  username: string;
  password: string;
}

export class RegisterUserRequest extends LoginUserRequest {
  id?: string;
  fullName: string;
}

export class UserResponse {
  id?: string;
  fullName?: string;
  username?: string;
}

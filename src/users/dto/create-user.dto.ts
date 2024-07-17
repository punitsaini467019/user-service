export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: any;
  token?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}

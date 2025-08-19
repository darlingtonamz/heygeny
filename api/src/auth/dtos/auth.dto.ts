import {
    IsString, IsDefined, IsEmail, IsNotEmpty, MinLength,
} from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public password: string;
}

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @MinLength(8)
  public password: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public phone: string;
}
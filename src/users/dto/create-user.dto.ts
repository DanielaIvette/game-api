import { IsOptional, IsString, MinLength }  from "class-validator";
import { IsEmail } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    fullname: string;

    @IsEmail()
    email: string; 

@IsString()
@MinLength(8) 
password: string;
}

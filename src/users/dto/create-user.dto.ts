import { IsBoolean, IsOptional, IsString, MinLength }  from "class-validator";
import { IsEmail } from "class-validator";

export class CreateUserDto {


    @IsString()
    @MinLength(3)
    fullname: string;

    @IsEmail()
    email: string; 

@IsBoolean()
@IsOptional() 
isActive_bool?: boolean;
}

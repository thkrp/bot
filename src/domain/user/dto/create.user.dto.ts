import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
    @IsNumber()
    @IsNotEmpty()
    telegramId: number;
}

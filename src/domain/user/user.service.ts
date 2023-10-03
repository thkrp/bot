import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async hasUserSubscribedToBot(telegramUserId: number): Promise<boolean> {
        const existing: User | null = await this.userRepository.findOne({
            where: {
                telegramId: telegramUserId
            }
        });

        return Boolean(existing);
    }

    async subscribe(telegramUserId: number) {
        try {
            const dto: CreateUserDto = {
                telegramId: telegramUserId
            };
            const createdUser: User = this.userRepository.create(dto);
            const {
                identifiers: [{ id: userId }]
            }: InsertResult = await this.userRepository.insert(createdUser);
            return userId as string;
        } catch (e) {
            throw new Error('You are already subscribed');
        }
    }
}

import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../../src/domain/user/user.service';
import { User } from '../../../src/domain/user/user.entity';
import { MockType } from '../../types/mock.type';
import { repositoryMockFactory } from '../../helpers/repository.helper';
import { UserRole } from '../../../src/domain/user/enums/user.role.enum';

describe('UserService', () => {
    let service: UserService;
    let repositoryMock: MockType<Repository<User>>;
    const user = {
        telegramId: 0,
        role: UserRole.USER,
        id: '70e2a026-fcf2-434c-a13e-b88e8fb97096'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, { provide: getRepositoryToken(User), useFactory: repositoryMockFactory }]
        }).compile();
        service = module.get<UserService>(UserService);
        repositoryMock = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('hasUserSubscribedToBot should return false if the user is not subscribed', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        repositoryMock.findOne.mockReturnValue(null);
        expect(await service.hasUserSubscribedToBot(user.telegramId)).toBeFalsy();
    });

    it('hasUserSubscribedToBot should return true if the user is subscribed', async () => {
        repositoryMock.findOne.mockReturnValue(user);
        expect(await service.hasUserSubscribedToBot(user.telegramId)).toBeTruthy();
    });

    it('subscribe should return the user id', async () => {
        repositoryMock.insert.mockReturnValue({ identifiers: [{ id: user.id }] });
        expect(await service.subscribe(user.telegramId)).toBe(user.id);
    });
});

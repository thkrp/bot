import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../helpers/repository.helper';
import { TgUserReactionService } from '../../../src/domain/tg-user-reaction/tg.user.reaction.service';
import { TgUserReaction } from '../../../src/domain/tg-user-reaction/tg.user.reaction.entity';
import { TgReactionService } from '../../../src/domain/tg-reaction/tg.reaction.service';
import { TgReaction } from '../../../src/domain/tg-reaction/tg.reaction.entity';

describe('TgUserReactionService', () => {
    let service: TgUserReactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: getRepositoryToken(TgUserReaction), useFactory: repositoryMockFactory },
                { provide: getRepositoryToken(TgReaction), useFactory: repositoryMockFactory },
                TgReactionService,
                TgUserReactionService
            ]
        }).compile();
        service = module.get<TgUserReactionService>(TgUserReactionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

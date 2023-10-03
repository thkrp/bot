import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../helpers/repository.helper';
import { TgReactionService } from '../../../src/domain/tg-reaction/tg.reaction.service';
import { TgReaction } from '../../../src/domain/tg-reaction/tg.reaction.entity';

describe('TgReactionService', () => {
    let service: TgReactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: getRepositoryToken(TgReaction), useFactory: repositoryMockFactory },
                TgReactionService
            ]
        }).compile();
        service = module.get<TgReactionService>(TgReactionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

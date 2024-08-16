import { Repository } from 'typeorm';
import { MockType } from '../types/mock.type';

type ReturnType = MockType<Repository<object>>;
export const repositoryMockFactory: () => ReturnType = jest.fn(
    () =>
        ({
            findOne: jest.fn(),
            insert: jest.fn(),
            create: jest.fn()
        } as ReturnType)
);

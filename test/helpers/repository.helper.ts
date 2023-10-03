import { Repository } from 'typeorm';
import { MockType } from '../types/mock.type';

export const repositoryMockFactory: () => MockType<Repository<unknown>> = jest.fn(() => ({
    findOne: jest.fn(),
    insert: jest.fn(),
    create: jest.fn()
}));

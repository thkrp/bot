import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { pickRandom, range } from '../../util/array.utils';
import { convertArrayToPgTextArray } from '../../util/postgresql.utils';
import { random } from '../../util/math.utils';
import { Transition } from './transition.entity';
import { Token } from './types/token.type';
import { TransitionMatrix } from './types/transition.matrix.type';
import { Tokenizer } from './tokenizer';
import { Chars } from './enums/chars.enum';
import { wordListToFix } from './word.list.to.fix';

@Injectable()
export class TextGeneratorService {
    private readonly sampleSize = 3;
    constructor(
        @InjectRepository(Transition)
        private readonly transitionRepository: Repository<Transition>,
        private readonly tokenizer: Tokenizer
    ) {}

    #escapeString(token: Token) {
        return `${Chars.escapeChars}${token}`;
    }
    #fromTokens(tokens: Token[]) {
        return this.#escapeString(tokens.join(''));
    }

    #sliceCorpus(corpus: Token[]): Array<Token[]> {
        return corpus
            .map((_, index) => corpus.slice(index, index + this.sampleSize))
            .filter(group => group.length === this.sampleSize);
    }

    async doesStateExist(state: string, tgGroupId: number): Promise<boolean> {
        const existing: Transition | null = await this.transitionRepository.findOne({
            where: {
                state,
                tgGroupId
            }
        });
        return Boolean(existing);
    }

    #collectTransitions(text: string): TransitionMatrix {
        const corpus = this.tokenizer.tokenize(text);
        const samples = this.#sliceCorpus(corpus);

        return samples.reduce((transitions, sample) => {
            const lastIndex = sample.length - 1;
            const lastToken = sample[lastIndex];
            const restTokens = sample.slice(0, lastIndex);

            const state = this.#fromTokens(restTokens);
            const next = lastToken;

            transitions[state] = transitions[state] ?? [];
            transitions[state].push(next);
            return transitions;
        }, {});
    }

    async saveTransitions(text: string, tgGroupId: number) {
        const transitions = this.#collectTransitions(text);
        await Promise.all(
            Object.entries(transitions).map(async ([state, nextValues]) => {
                const existing = await this.doesStateExist(state, tgGroupId);
                if (!existing) {
                    await this.transitionRepository.save({ tgGroupId, state, next: nextValues });
                } else {
                    await this.transitionRepository
                        .createQueryBuilder()
                        .update(Transition)
                        .where('transition.state = :state', { state })
                        .andWhere('transition.tg_group_id = :tgGroupId', { tgGroupId })
                        .set({ next: () => `array_cat("next", '${convertArrayToPgTextArray(nextValues)}')` })
                        .execute();
                }
            })
        );
    }

    async #findByWordInState(groupId: number, word?: string) {
        return await this.transitionRepository
            .createQueryBuilder()
            .select()
            .where('LOWER(state) like LOWER(:word)', { word: `%${word ?? ''}%` })
            .andWhere('tg_group_id = :groupId', { groupId })
            .orderBy('RANDOM()')
            .getOne();
    }

    async #createChain(groupId: number, startText: string) {
        try {
            const random =
                (await this.#findByWordInState(groupId, startText)) || (await this.#findByWordInState(groupId, null));
            return this.tokenizer.tokenize(random?.state);
        } catch {
            return [];
        }
    }

    async #predictNext(groupId: number, chain: string[], sampleSize: number) {
        const lastState = this.#fromTokens(chain.slice(-(sampleSize - 1)));
        const transition = await this.transitionRepository
            .createQueryBuilder()
            .select()
            .where('state = :state', { state: lastState })
            .andWhere('tg_group_id = :groupId', { groupId })
            .getOne();
        const nextWords = transition?.next ?? [];
        return pickRandom(nextWords);
    }

    async *#generateChain(groupId: number, startChain: string[]) {
        const chain = [...startChain];
        while (true) {
            const state = await this.#predictNext(groupId, chain, this.sampleSize);
            yield state;
            if (state) {
                chain.push(state);
            } else {
                chain.pop();
            }
        }
    }

    #needToFix(lastItem: string) {
        return wordListToFix.includes(lastItem && lastItem.toLowerCase()) || /[a-zA-Zа-яА-ЯёЁ],/.test(lastItem);
    }

    async #fixEndOfChain(lastItem: string, generator: AsyncGenerator<string, void>, chain: string[] = []) {
        if (this.#needToFix(lastItem)) {
            const value = (await generator.next()).value as string;
            if (value) {
                chain.push(value);
                if (this.#needToFix(value)) {
                    return await this.#fixEndOfChain(value, generator, chain);
                }
                return chain;
            }
            return chain;
        }
        return chain;
    }

    async generateText(groupId: number, text?: string) {
        let startText = null;
        if (text) {
            startText = pickRandom(text.split(' '));
        }
        const startChain = await this.#createChain(groupId, startText);
        const generator = this.#generateChain(groupId, startChain);
        const length = random(12, 50);
        const chain = await range(length).reduce<Promise<string[]>>(async (acc: Promise<string[]>) => {
            const chain = await acc;
            const value = (await generator.next()).value as string;
            const prevValue = chain[chain.length - 1];
            const isWord = new RegExp('[a-zA-Zа-яА-ЯёЁ]+');

            if (value && isWord.test(prevValue) && isWord.test(value) && chain[chain.length - 1] !== value) {
                return Promise.resolve([...chain, ' ', value]);
            }
            if (chain[chain.length - 1] === value || !value) {
                return Promise.resolve([...chain]);
            }
            return Promise.resolve([...chain, value]);
        }, Promise.resolve([]));

        const endOfChain = await this.#fixEndOfChain(chain[chain.length - 1], generator);

        return this.tokenizer.textify([...startChain, ...chain, ...endOfChain]);
    }
}

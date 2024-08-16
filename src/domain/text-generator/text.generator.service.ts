import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { pickRandom, range } from '../../util/array.utils';
import { random } from '../../util/math.utils';
import { Transition } from './transition.schema';
import { Token } from './types/token.type';
import { TransitionMatrix } from './types/transition.matrix.type';
import { Tokenizer } from './tokenizer';
import { Chars } from './enums/chars.enum';
import { wordListToFix } from './word.list.to.fix';

@Injectable()
export class TextGeneratorService {
    private readonly sampleSize = 5;
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(Transition.name) private transitionModel: Model<Transition>,
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
        const existing = await this.transitionModel.exists({
            state,
            tg_group_id: tgGroupId
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
        }, {} as TransitionMatrix);
    }

    async saveTransitions(text: string, tgGroupId: number) {
        const transitions = this.#collectTransitions(text);
        await Promise.all(
            Object.entries(transitions).map(async ([state, nextValues]) => {
                const existing = await this.doesStateExist(state, tgGroupId);
                if (!existing) {
                    const model = new this.transitionModel({ tg_group_id: tgGroupId, state, next: nextValues });
                    await model.save();
                } else {
                    await this.transitionModel.updateOne(
                        { tg_group_id: tgGroupId, state },
                        { $push: { next: { $each: nextValues } } }
                    );
                }
            })
        );
    }

    async #findByWordInState(groupId: number, word?: string | null) {
        const [transition] = await this.transitionModel
            .aggregate([
                {
                    $match: {
                        state: { $regex: word ? new RegExp(word, 'i') : null },
                        tg_group_id: groupId
                    }
                },
                { $sample: { size: 1 } }
            ])
            .exec();
        return transition;
    }

    async #createChain(groupId: number, startText: string | null) {
        try {
            const random = await this.#findByWordInState(groupId, startText);
            return this.tokenizer.tokenize(random?.state);
        } catch {
            return [];
        }
    }

    async #predictNext(groupId: number, chain: string[], sampleSize: number) {
        const lastState = this.#fromTokens(chain.slice(-(sampleSize - 1)));
        const transition = await this.transitionModel.findOne({ state: lastState, tg_group_id: groupId });
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

    async #fixEndOfChain(
        lastItem: string,
        generator: AsyncGenerator<string, void>,
        chain: string[] = []
    ): Promise<string[]> {
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
        const textLength = random(12, 150);
        const chain = await range(textLength).reduce<Promise<string[]>>(async (acc: Promise<string[]>) => {
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

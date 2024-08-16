import { Tokenizer } from '../../../src/domain/text-generator/tokenizer';

describe('tokenizer', () => {
    let tokenizer: Tokenizer;
    beforeAll(() => {
        tokenizer = new Tokenizer();
    });

    it('should split a text into an array and replace the new line with §', () => {
        const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        In facilisis nulla mollis`;

        expect(tokenizer.tokenize(text)).toEqual([
            'Lorem',
            ' ',
            'ipsum',
            ' ',
            'dolor',
            ' ',
            'sit',
            ' ',
            'amet',
            ',',
            ' ',
            'consectetur',
            ' ',
            'adipiscing',
            ' ',
            'elit',
            '.',
            '§',
            'In',
            ' ',
            'facilisis',
            ' ',
            'nulla',
            ' ',
            'mollis'
        ]);
    });

    it('should return text from an array without the _+ and §', () => {
        const array = [
            '_',
            '+',
            '_+Lorem',
            ' ',
            'ipsum',
            ' ',
            'dolor',
            ' ',
            'sit',
            ' ',
            'amet',
            ',',
            ' ',
            'consectetur',
            ' ',
            'adipiscing',
            ' ',
            'elit',
            '.',
            '§',
            'In',
            ' ',
            'facilisis',
            ' ',
            'nulla',
            ' ',
            'mollis'
        ];

        expect(tokenizer.textify(array)).toBe(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis nulla mollis'
        );
    });
});

import { Chars } from './enums/chars.enum';

export class Tokenizer {
    private readonly NEWLINE_PLACEHOLDER = '§';
    private readonly PARAGRAPH_CHARACTER = ' ';
    private readonly punctuation = `[](){}!?.,:;'"\/*&^%$_+-–—=<>@|~`.split('').join('\\');
    private readonly ellipsis = '\\.{3}';
    private readonly words = '[a-zA-Zа-яА-ЯёЁ]+';
    private readonly compounds = `${this.words}-${this.words}`;
    private readonly newlinesRegex = /\n\s*/g;
    private readonly tokenizeRegex: RegExp;
    constructor() {
        this.tokenizeRegex = new RegExp(`(${this.ellipsis}|${this.compounds}|${this.words}|[${this.punctuation}])`);
    }

    #exists(entity: string) {
        return !!entity;
    }

    tokenize(text: string): string[] {
        return text
            .replaceAll(this.newlinesRegex, this.NEWLINE_PLACEHOLDER)
            .split(this.tokenizeRegex)
            .filter(this.#exists);
    }

    textify(tokens: string[]): string {
        return tokens
            .filter(this.#exists)
            .join('')
            .replaceAll(this.NEWLINE_PLACEHOLDER, this.PARAGRAPH_CHARACTER)
            .replaceAll(Chars.escapeChars, '');
    }
}

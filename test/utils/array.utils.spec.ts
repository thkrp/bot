import { pickRandom, range } from '../../src/util/array.utils';
import { limitNumber } from '../../src/util/math.utils';

describe('array utils', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    it('should return an array of a certain length', () => {
        const count = 5;
        const array = range(count);
        expect(array.length).toBe(5);
    });

    it('should return a random element of array', () => {
        const count = 5;
        const array = range(count);
        const element = pickRandom(array);
        expect(element).toBe(2);
    });

    it('limitNumber should return 0', () => {
        const number = limitNumber(-5, 0, 100);
        expect(number).toBe(0);
    });

    it('limitNumber should return 100', () => {
        const number = limitNumber(230, 0, 100);
        expect(number).toBe(100);
    });

    it('limitNumber should return number between 0 and 100', () => {
        const number = limitNumber(55, 0, 100);
        expect(number).toBe(55);
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });
});

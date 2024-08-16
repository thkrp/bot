import { random, randomBoolean } from '../../src/util/math.utils';

describe('math utils', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    it('random should return a random number between min and max value', () => {
        const number = random(1, 50);
        expect(number).toBe(26);
    });

    it('randomBoolean should return true with a frequency of 30 percent, result - true', () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.2);
        const result = randomBoolean(30);
        expect(result).toBeTruthy();
    });

    it('randomBoolean should return true with a frequency of 30 percent, result - false', () => {
        const result = randomBoolean(30);
        expect(result).toBeFalsy();
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });
});

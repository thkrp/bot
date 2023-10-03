import { convertArrayToPgTextArray } from '../../src/util/postgresql.utils';

describe('postgresql utils', () => {
    it('convertArrayToPgTextArray should return a string with { and } instead [ and ]', () => {
        const array = ['1', '2', '3'];
        const convertedArray = convertArrayToPgTextArray(array);
        expect(convertedArray).toBe('{"1","2","3"}');
    });
});

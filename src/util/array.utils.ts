import { random } from './math.utils';

export const range = (count: number) => {
    return Array.from(Array(count).keys());
};

export const pickRandom = <T>(list: T[]) => {
    return list[random(0, list.length - 1)];
};

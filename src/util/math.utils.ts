export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomBoolean = (percent: number) => {
    return Math.random() < percent / 100;
};

export const limitNumber = (number: number, min: number, max: number) => {
    return Math.min(Math.max(number, min), max);
};

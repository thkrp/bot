export const convertArrayToPgTextArray = (array: string[]) => JSON.stringify(array).replace('[', '{').replace(']', '}');

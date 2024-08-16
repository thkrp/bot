import * as path from 'path';

export const getProjectRoot = () => {
    return path.dirname(require.main?.filename as string);
};

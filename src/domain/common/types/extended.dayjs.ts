import dayjs from 'dayjs';

export type ExtendedDayjs = dayjs.Dayjs & {
    utc: () => ExtendedDayjs;
};

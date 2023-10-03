/* eslint-disable */
import { SceneSession } from 'telegraf/typings/scenes';

export interface GroupState {
    chance: number;
}

export interface SessionState {
    [key: string]: GroupState;
}

export interface Session extends SceneSession {
    state: SessionState;
}

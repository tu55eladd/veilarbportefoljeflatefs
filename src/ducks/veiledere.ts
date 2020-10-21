import {hentEnhetsVeiledere} from '../middleware/api';
import {STATUS, doThenDispatch} from './utils';
import {VeilederModell} from '../model-interfaces';

// Actions
export const OK = 'veilarbveileder/veiledere/OK';
export const FEILET = 'veilarbveileder/veiledere/FEILET';
export const PENDING = 'veilarbveileder/veiledere/PENDING';

export interface VeiledereState {
    status: string;
    data: {
        veilederListe: VeilederModell[];
    };
}

const initialState = {
    status: STATUS.NOT_STARTED,
    data: {
        veilederListe: []
    }
};

//  Reducer
export default function reducer(state: VeiledereState = initialState, action) {
    switch (action.type) {
        case PENDING:
            return {...state, status: STATUS.PENDING};
        case FEILET:
            return {...state, status: STATUS.ERROR, data: action.data};
        case OK:
            return {...state, status: STATUS.OK, data: action.data};
        default:
            return state;
    }
}

// Action Creators
export function hentVeiledereForEnhet(enhetId) {
    return doThenDispatch(() => hentEnhetsVeiledere(enhetId), {
        OK,
        FEILET,
        PENDING
    });
}

import {HUSKELAPP_SLETT_OK, slettHuskelappAction} from '../../ducks/huskelapp';
import {leggTilStatustall} from '../../ducks/statustall-veileder';
import {hentHuskelappForBruker} from '../../ducks/portefolje';
import {ThunkDispatch} from 'redux-thunk';
import {AppState} from '../../reducer';
import {AnyAction} from 'redux';
import {HuskelappModell} from '../../model-interfaces';

export const handleSlettHuskelapp = async (
    dispatch: ThunkDispatch<AppState, any, AnyAction>,
    huskelapp: HuskelappModell,
    fnr: string,
    enhetId: string
) => {
    const {type: responseAtion} = await dispatch(slettHuskelappAction(huskelapp.huskelappId!!));
    if (responseAtion === HUSKELAPP_SLETT_OK) {
        await dispatch(leggTilStatustall('mineHuskelapper', -1));
        hentHuskelappForBruker(fnr, enhetId)(dispatch);
    }
};

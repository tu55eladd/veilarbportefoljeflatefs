import {endreHuskelappAction, HUSKELAPP_ENDRE_OK} from '../../ducks/huskelapp';
import {hentHuskelappForBruker} from '../../ducks/portefolje';
import {ThunkDispatch} from 'redux-thunk';
import {AppState} from '../../reducer';
import {AnyAction} from 'redux';
import {BrukerModell} from '../../model-interfaces';
import {FormikValues} from 'formik';

export const endreHuskelapp = async (
    dispatch: ThunkDispatch<AppState, any, AnyAction>,
    values: FormikValues,
    bruker: BrukerModell,
    enhetId: string,
    onModalClose: () => void,
    huskelappId: string
) => {
    const {type: responseAction} = await endreHuskelappAction({
        huskelappId: huskelappId,
        brukerFnr: bruker.fnr,
        enhetId: enhetId,
        frist: values.frist?.toString(),
        kommentar: values.kommentar
    })(dispatch);
    if (responseAction === HUSKELAPP_ENDRE_OK) {
        hentHuskelappForBruker(bruker.fnr, enhetId)(dispatch);
        onModalClose();
    }
};

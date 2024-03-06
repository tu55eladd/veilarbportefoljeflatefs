import {ArbeidslisteDataModell} from '../../model-interfaces';
import {visServerfeilModal} from '../../ducks/modal-serverfeil';
import {leggTilStatustall} from '../../ducks/statustall-veileder';
import {oppdaterArbeidslisteForBruker} from '../../ducks/portefolje';

export const oppdaterStateVedSlettArbeidsliste = (res, arbeidsliste: ArbeidslisteDataModell[], dispatch) => {
    if (!res) {
        return visServerfeilModal()(dispatch);
    }
    const brukereOK = res.data.data;

    const arbeidslisteToDispatch = arbeidsliste
        .map(a => ({
            ...a,
            arbeidslisteAktiv: false
        }))
        .filter(bruker => brukereOK.includes(bruker.fnr));

    leggTilStatustall('minArbeidsliste', -brukereOK.length)(dispatch);

    return oppdaterArbeidslisteForBruker(arbeidslisteToDispatch)(dispatch);
};

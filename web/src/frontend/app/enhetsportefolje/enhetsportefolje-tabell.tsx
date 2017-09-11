import * as React from 'react';
import {connect} from 'react-redux';
import {enhetShape, filtervalgShape, veilederShape} from './../proptype-shapes';
import EnhetBrukerpanel from './enhet-brukerpanel';
import {settBrukerSomMarkert, markerAlleBrukere} from '../ducks/portefolje';
import EnhetListehode from './enhet-listehode';
import {
    FiltervalgModell, Sorteringsrekkefolge, ValgtEnhetModell,
    VeilederModell
} from "../model-interfaces";
import {Kolonne} from "../ducks/ui/listevisning";

interface EnhetTabellProps {
    portefolje: any;
    valgtEnhet: ValgtEnhetModell;
    sorteringsrekkefolge: Sorteringsrekkefolge;
    settMarkert: (string, boolean) => any;
    filtervalg: FiltervalgModell;
    settSorteringOgHentPortefolje: Function;
    veiledere: VeilederModell;
    valgteKolonner: Kolonne[];
}

const finnBrukersVeileder = (veiledere, bruker) => (veiledere.find((veileder) => veileder.ident === bruker.veilederId));

function EnhetTabell({
                         settMarkert, portefolje, settSorteringOgHentPortefolje,
                         filtervalg, sorteringsrekkefolge, valgtEnhet, veiledere, valgteKolonner
                     }: EnhetTabellProps) {
    const {brukere} = portefolje.data;
    const {enhetId} = valgtEnhet.enhet;
    return (

        <div className="enhet-liste__wrapper typo-undertekst">
            <EnhetListehode
                sorteringsrekkefolge={sorteringsrekkefolge}
                sorteringOnClick={settSorteringOgHentPortefolje}
                filtervalg={filtervalg}
                sorteringsfelt={portefolje.sorteringsfelt}
                valgteKolonner={valgteKolonner}
            />
            <ul className="enhet-brukere-liste">
                {brukere.map((bruker) =>
                    <li key={bruker.fnr} className="enhet-brukere-panel">
                        <EnhetBrukerpanel
                            bruker={bruker}
                            enhetId={enhetId}
                            settMarkert={settMarkert}
                            filtervalg={filtervalg}
                            valgteKolonner={valgteKolonner}
                            brukersVeileder={finnBrukersVeileder(veiledere, bruker)}
                        />
                    </li>)}
            </ul>
        </div>
    );
}


const mapStateToProps = (state) => ({
    portefolje: state.portefolje,
    valgtEnhet: state.enheter.valgtEnhet,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    filtervalg: state.filtrering,
    valgteKolonner: state.ui.listevisning.valgte
});

const mapDispatchToProps = (dispatch) => ({
    settMarkert: (fnr, markert) => dispatch(settBrukerSomMarkert(fnr, markert))
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhetTabell);

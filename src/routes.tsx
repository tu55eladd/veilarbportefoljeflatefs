import React from 'react';
import 'moment/locale/nb';
import {Route, Switch} from 'react-router-dom';
import MinoversiktSide from './minoversikt/minoversikt-side';
import EnhetSide from './enhetsportefolje/enhet-side';
import VeiledereSide from './veiledere/veiledere-side';
import TilbakemeldingFab from './components/tilbakemelding/tilbakemelding-fab';
import {loggBrowserMetrikker} from './utils/metrikker/browser-metrikker';
import {useFetchPortefoljeData} from './hooks/portefolje/use-fetch-portefolje-data';
import Innholdslaster from './innholdslaster/innholdslaster';
import TourModalLocalStorage from './components/modal/tour-modal/tour-modal-local-storage';
import {TilToppenKnapp} from './components/til-toppen-knapp/til-toppen-knapp';
import './style.less';
import {AlertStripeFeil} from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import {useFeatureSelector} from './hooks/redux/use-feature-selector';
import {ALERTSTRIPE_FEILMELDING} from './konstanter';

loggBrowserMetrikker();

function Routes() {
    const {enhettiltak, veiledere, portefoljestorrelser} = useFetchPortefoljeData();
    const erAlertstripeFeilmeldingFeatureTogglePa = useFeatureSelector()(ALERTSTRIPE_FEILMELDING);

    return (
        <div className="portefolje">
            <div className="maincontent side-innhold">
                {erAlertstripeFeilmeldingFeatureTogglePa && (
                    <AlertStripeFeil className="stor-feil-modal">
                        Vi har for tiden problemer med overføringen av data mellom applikasjonene. Dette kan medføre
                        ustabilitet og feil i filtreringene.{' '}
                        <Lenke href="https://navno.sharepoint.com/sites/intranett-driftsmeldinger/SitePages/Feil-og-ustabilitet-i-Enhetens--og-Min-oversikt-i-Modia.aspx?web=1">
                            Følg med på driftsmelding på Navet
                        </Lenke>
                    </AlertStripeFeil>
                )}
                <Innholdslaster avhengigheter={[enhettiltak, veiledere, portefoljestorrelser]}>
                    <Switch>
                        <Route path="/enhet" component={EnhetSide} />
                        <Route path="/veiledere" component={VeiledereSide} />
                        <Route path="/portefolje/:ident" component={MinoversiktSide} />
                        <Route path="/portefolje" component={MinoversiktSide} />
                    </Switch>
                    <TilbakemeldingFab />
                    <TilToppenKnapp />
                    <TourModalLocalStorage skalVises={false} />
                </Innholdslaster>
            </div>
        </div>
    );
}

export default Routes;

import * as React from 'react';
import classnames from 'classnames';
import { IntlProvider, addLocaleData } from 'react-intl';
import nb from 'react-intl/locale-data/nb';
import queryString from 'query-string';
import EnhetContext from './components/enhet-context/enhet-context';
import tekstBundle from './tekster-built/bundle';
import {Route, Switch, Redirect, withRouter} from "react-router-dom";
import EnhetSide from "./enhet/enhet-side";
import VeiledereSide from "./veiledere/veiledere-side";
import MinOversiktSide from "./minoversikt/minoversikt-side";
import TilbakemeldingFab from "./components/tilbakemelding/tilbakemelding-fab";

import * as moment from 'moment';
import 'moment/locale/nb';

moment.locale('nb');

function mapTeksterTilNokkelDersomAngitt(ledetekster) {
    const skalViseTekstnokkel = queryString.parse(window.location.search).vistekster; // eslint-disable-line no-undef
    if (skalViseTekstnokkel) {
        return Object.keys(ledetekster).reduce((obj, curr) => ({ ...obj, [curr]: curr }), {});
    }
    return ledetekster;
}

addLocaleData(nb);

function Application (props) {
    return (
        <IntlProvider
            defaultLocale="nb"
            locale="nb"
            messages={mapTeksterTilNokkelDersomAngitt(tekstBundle.nb)}
        >
            <div className="portefolje">
                <EnhetContext >
                    <div
                        className = {classnames('maincontent', 'side-innhold')}
                    >
                        <Switch>
                            <Route
                                path="/enhet"
                                component={EnhetSide}
                             />
                            <Route
                                path="/veiledere"
                                component={VeiledereSide}
                            />
                            <Route
                                path="/portefolje/:ident"
                                render={(props) => <MinOversiktSide {...props}/>}
                            />
                            <Route
                                path="/portefolje"
                                render={(props) => <MinOversiktSide {...props}/>}
                            />
                            <Route
                                render={() => {
                                    const lastPath = localStorage.getItem('lastpath');
                                    const lastSearch = localStorage.getItem('lastsearch');
                                    if (lastPath && props.location.pathname === "/tilbake") {
                                        return (
                                            <Redirect to={{
                                                pathname: lastPath,
                                                search: lastSearch
                                            }}/>);
                                    } else {
                                        return <Redirect to={'/enhet'}/>;
                                    }
                                }}
                            />
                        </Switch>
                        <TilbakemeldingFab/>
                    </div>
                </EnhetContext>
            </div>
        </IntlProvider>
    );
}

/*
Application.propTypes = {
    settSide: PT.func.isRequired,
    routes: PT.arrayOf(PT.object).isRequired,
    side: PT.string.isRequired,
    flyttFilterTilVenstre: PT.bool,
    children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
    enheter: PT.shape({
        data: PT.arrayOf(enhetShape).isRequired,
        valgtEnhet: valgtEnhetShape.isRequired,
        ident: PT.string,
        status: PT.string.isRequired
    }).isRequired,
    veiledere: PT.shape({
        status: PT.string.isRequired,
        data: veiledereShape.isRequired,
        veiledereITabell: PT.arrayOf(veiledereShape)
    }).isRequired
};
*/


export default withRouter(Application);
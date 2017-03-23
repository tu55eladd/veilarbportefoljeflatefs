import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst } from 'nav-frontend-typografi';
import LenkerMinoversikt from './../lenker/lenker-minoversikt';
import VeilederPortefoljeVisning from './minoversikt-portefolje-visning';
import TildelVeilederVelger from './../enhet/tildel-veileder-velger';
import { veilederShape, brukerShape } from '../proptype-shapes';
import { tildelVeileder } from '../ducks/portefolje';

function MinOversiktSide({ veilederFraState, brukere, veiledere, velgVeileder, routes, ...props }) {
    const veilederFraUrl = veiledere.find(veileder => (veileder.ident === props.params.ident));
    const veileder = veilederFraUrl || veilederFraState;

    const annenVeilederVarsel = (<Normaltekst tag="h1" className="blokk-s">
        <FormattedMessage
            id="annen.veileder.portefolje.advarsel"
            tagName="em"
            values={{
                fornavn: veileder.fornavn,
                etternavn: veileder.etternavn
            }}
        /></Normaltekst>);


    const tildelVeilederVelger =
        (<TildelVeilederVelger
            veiledere={veiledere}
            brukere={brukere}
            velgVeileder={(tildelinger, tilVeileder) => velgVeileder(tildelinger, tilVeileder)}
        />);

    return (
        <div>
            {veilederFraUrl ?
                <Link to="veiledere" className="typo-normal tilbaketilveileder">
                    <i className="chevron--venstre" />
                    <span>Til veilederoversikt</span>
                </Link> : null}
            <section className={veilederFraUrl ? 'annen-veileder' : ''}>
                {veilederFraUrl ? annenVeilederVarsel : null}
                <div className="portefolje-side">
                    <LenkerMinoversikt routes={routes} />
                    <Ekspanderbartpanel tittel="Tildel veileder" tittelProps="undertittel">
                        {tildelVeilederVelger}
                    </Ekspanderbartpanel>
                    <VeilederPortefoljeVisning veileder={veileder} />
                </div>
            </section>
        </div>
    );
}

MinOversiktSide.propTypes = {
    veilederFraState: veilederShape.isRequired,
    routes: PT.arrayOf(PT.object),
    veiledere: PT.arrayOf(veilederShape).isRequired,
    brukere: PT.arrayOf(brukerShape).isRequired,
    velgVeileder: PT.func.isRequired,
    params: PT.object.isRequired
};

const mapStateToProps = state => ({
    veilederFraState: state.portefolje.veileder,
    brukere: state.portefolje.data.brukere,
    veiledere: state.veiledere.data.veilederListe
});

const mapDispatchToProps = dispatch => ({
    velgVeileder: (tildelinger, tilVeileder) => dispatch(tildelVeileder(tildelinger, tilVeileder))
});

export default connect(mapStateToProps, mapDispatchToProps)(MinOversiktSide);


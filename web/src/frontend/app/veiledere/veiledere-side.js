import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { veilederShape, enhetShape } from './../proptype-shapes';
import VeiledereTabell from './veiledere-tabell';
import { hentVeiledereForEnhet } from './../ducks/veiledere';
import Innholdslaster from '../innholdslaster/innholdslaster';
import { velgEnhetForVeileder } from './../ducks/enheter';
import EnhetVelger from './../enhet/enhet-velger';

class VeiledereSide extends Component {

    componentWillMount() {
        this.props.hentVeiledere(this.props.enhetsListe[0].enhetId);
    }

    render() {
        const { ident, veiledere, enhetsListe, valgtEnhet, hentVeiledere, velgEnhet } = this.props;
        const { veilederListe } = veiledere.data;

        return (
            <div className="veiledere-side panel">
                <EnhetVelger
                    enheter={enhetsListe} valgtEnhet={valgtEnhet} velgEnhet={(enhet) => {
                        velgEnhet(enhet);
                        hentVeiledere(enhet.enhetId);
                    }}
                />
                <h1 className="typo-innholdstittel">
                    <FormattedMessage
                        id="enhet.veiledere.tittel"
                        values={{ antallVeiledere: veilederListe.length }}
                    />
                </h1>
                <Innholdslaster avhengigheter={[veiledere]}>
                    <VeiledereTabell veiledere={veilederListe} ident={ident} />
                </Innholdslaster>
            </div>
        );
    }
}

VeiledereSide.propTypes = {
    ident: PT.string.isRequired,
    veiledere: PT.shape({
        data: PT.shape({
            enhet: enhetShape.isRequired,
            veilederListe: PT.arrayOf(veilederShape).isRequired
        }).isRequired
    }).isRequired,
    hentVeiledere: PT.func.isRequired,
    enhetsListe: PT.arrayOf(enhetShape).isRequired,
    valgtEnhet: enhetShape.isRequired,
    velgEnhet: PT.func.isRequired
};

const mapStateToProps = state => ({
    ident: state.enheter.ident,
    veiledere: state.veiledere,
    enhetsListe: state.enheter.data,
    valgtEnhet: state.enheter.valgtEnhet
});

const mapDispatchToProps = dispatch => ({
    hentVeiledere: enhetId => dispatch(hentVeiledereForEnhet(enhetId)),
    velgEnhet: enhet => dispatch(velgEnhetForVeileder(enhet))
});

export default connect(mapStateToProps, mapDispatchToProps)(VeiledereSide);


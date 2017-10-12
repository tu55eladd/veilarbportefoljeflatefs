import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ArbeidslisteModal from '../../modal/arbeidsliste-modal';
import { skjulModal, visModal } from '../../ducks/modal';
import { PortefoljeState } from '../../ducks/portefolje';

interface LeggTilArbeidslisteProps {
    portefolje: PortefoljeState;
    skalSkjules: boolean;
    visModal?: boolean;
    visArbeidslisteModal: () => void;
    visesAnnenVeiledersPortefolje: boolean;
}

class LeggTilArbeidsliste extends React.Component<LeggTilArbeidslisteProps> {
    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler() {
        this.props.visArbeidslisteModal();
    }

    arbeidslisteButton(valgteBrukere) {
        const inneholderBrukerMedArbeidsliste = valgteBrukere.some((bruker) => bruker.arbeidsliste.arbeidslisteAktiv);
        const arbeidslisteButton = (id) => (
            <button
                type="button"
                className="toolbar_btn"
                disabled={valgteBrukere.length < 1 || this.props.visesAnnenVeiledersPortefolje}
                onClick={this.onClickHandler}
            >
                <FormattedMessage id={id} />
            </button>
        );

        if (inneholderBrukerMedArbeidsliste) {
            return arbeidslisteButton('portefolje.slett.arbeidsliste.button');
        }

        return arbeidslisteButton('portefolje.legg.til.arbeidsliste.button');
    }

    render() {
        const { skalSkjules, portefolje } = this.props;
        const valgteBrukere = portefolje.data.brukere.filter((bruker) => bruker.markert === true);
        const modalSkalVises = this.props.visModal === true;

        if (skalSkjules) {
            return null;
        }
        return (
            <div className="toolbar_btnwrapper">
                { this.arbeidslisteButton(valgteBrukere) }
                {modalSkalVises && <ArbeidslisteModal isOpen={modalSkalVises} valgteBrukere={valgteBrukere} />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    skalSkjules: (state.ui.side.side || '') !== 'veilederoversikt',
    visModal: state.modal.visModal,
    portefolje: state.portefolje
});

const mapDispatchToProps = (dispatch) => ({
    visArbeidslisteModal: () => dispatch(visModal()),
    skjulArbeidslisteModal: () => dispatch(skjulModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(LeggTilArbeidsliste);

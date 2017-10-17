import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';

interface NyContextModalProps {
    isOpen: boolean;
    doEndreAktivEnhet: (nyEnhet: string) => void;
    doBeholdAktivEnhet: () => void;
    aktivEnhet: string;
}

class NyContextModal extends React.Component<NyContextModalProps> {
    render() {
        return (
            <NavFrontendModal
                contentLabel="Brukercontext"
                isOpen={this.props.isOpen}
                closeButton={false}
                onRequestClose={() => true}
            >
                <div className="brukercontext__modal">
                    <Innholdstittel tag="h1" className="blokk-s">
                        <FormattedMessage id="nyenhet.modal.overskrift" />
                    </Innholdstittel>
                    <AlertStripeAdvarselSolid className="blokk-s">
                        <FormattedMessage id="nyenhet.modal.alertmelding" />
                    </AlertStripeAdvarselSolid>
                    <Normaltekst className="blokk-s">
                        <FormattedMessage id="nyenhet.modal.sporsmal" values={{ enhet: this.props.aktivEnhet }}/>
                    </Normaltekst>
                    <div className="modal-footer" >
                        <Hovedknapp onClick={this.props.doBeholdAktivEnhet}>
                            <FormattedMessage id="nyenhet.modal.bekreft" />
                        </Hovedknapp>
                        <Knapp type="standard" onClick={() => this.props.doEndreAktivEnhet(this.props.aktivEnhet)}>
                            <FormattedMessage id="nyenhet.modal.avbryt" />
                        </Knapp>
                    </div>
                </div>
            </NavFrontendModal>
        );
    }
}

export default NyContextModal;

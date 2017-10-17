import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { beholdAktivEnhet, endreAktivEnhet, settTilkoblingState, visAktivEnhetModal, lukkAktivEnhetModal } from './context-reducer';
import { AppState } from '../../reducer';
import NyContextModal from './ny-context-modal';
import EnhetContextListener, {
    EnhetConnectionState, EnhetContextEvent,
    EnhetContextEventNames
} from './enhet-context-listener';
import { hentAktivEnhet } from './context-api';

interface StateProps {
    nyEnhetSynlig: boolean;
    tilkoblet: boolean;
    aktivEnhet: string;
}

interface DispatchProps {
    doVisAktivEnhetModal: () => void;
    doLukkAktivEnhetModal: () => void;
    doEndreAktivEnhet: () => void;
    doBeholdAktivEnhet: () => void;
    doSettTilkoblingState: (state: boolean) => void;
}

type EnhetContextProps = StateProps & DispatchProps;

class EnhetContext extends React.Component<EnhetContextProps> {
    contextListener: EnhetContextListener;

    constructor(props) {
        super(props);
        this.enhetContextHandler = this.enhetContextHandler.bind(this);
    }

    componentDidMount() {
        const uri = `wss://app-t4.adeo.no/modiaeventdistribution/websocket`;
        this.contextListener = new EnhetContextListener(uri, this.enhetContextHandler);
    }

    componentWillUnmount() {
        this.contextListener.close();
    }

    handleNyAktivEnhet() {
        hentAktivEnhet().then((nyEnhet) => {
            if (nyEnhet !== this.props.aktivEnhet) {
                this.props.doVisAktivEnhetModal();
            } else {
                this.props.doLukkAktivEnhetModal();
            }
        });
    }

    enhetContextHandler(event: EnhetContextEvent) {
        switch (event.type) {
            case EnhetContextEventNames.CONNECTION_STATE_CHANGED:
                const connected = event.state === EnhetConnectionState.CONNECTED;
                this.props.doSettTilkoblingState(connected);
                break;
            case EnhetContextEventNames.NY_AKTIV_ENHET:
                this.handleNyAktivEnhet();
                break;
        }
    }

    render() {
        return (
            <div>
                <AlertStripe solid={true} type={ this.props.tilkoblet ? 'suksess' : 'advarsel' }>
                    <span>Bruker i context: { this.props.tilkoblet ? 'TILKOBLET' : 'IKKE TILKOBLET' }</span>
                </AlertStripe>
                <NyContextModal
                    isOpen={this.props.nyEnhetSynlig}
                    aktivEnhet={this.props.aktivEnhet}
                    doEndreAktivEnhet={this.props.doEndreAktivEnhet}
                    doBeholdAktivEnhet={this.props.doBeholdAktivEnhet}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    const valgtEnhet = state.enheter.valgtEnhet.enhet;
    return {
        nyEnhetSynlig: state.nycontext.nyEnhetModalSynlig,
        tilkoblet: state.nycontext.connected,
        aktivEnhet: valgtEnhet == null ? '' : valgtEnhet.enhetId
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        doVisAktivEnhetModal: () => dispatch(visAktivEnhetModal()),
        doLukkAktivEnhetModal: () => dispatch(lukkAktivEnhetModal()),
        doEndreAktivEnhet: () => dispatch(endreAktivEnhet()),
        doBeholdAktivEnhet: () => dispatch(beholdAktivEnhet()),
        doSettTilkoblingState: (state: boolean) => dispatch(settTilkoblingState(state))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhetContext);

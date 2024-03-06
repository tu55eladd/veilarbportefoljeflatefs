import React from 'react';
import classNames from 'classnames';
import {Alert, Button, Modal} from '@navikt/ds-react';
import {HuskelappModalHeader} from './HuskelappModalHeader';
import {
    ArbeidslisteDataModell,
    ArbeidslisteModell,
    BrukerModell,
    HuskelappModell,
    Status
} from '../../model-interfaces';
import './huskelapp.css';
import {usePortefoljeSelector} from '../../hooks/redux/use-portefolje-selector';
import {OversiktType} from '../../ducks/ui/listevisning';
import {ThunkDispatch} from 'redux-thunk';
import {AppState} from '../../reducer';
import {AnyAction} from 'redux';
import {useDispatch, useSelector} from 'react-redux';
import {HuskelappInfoAlert} from './HuskelappInfoAlert';
import {Form, Formik} from 'formik';
import {visServerfeilModal} from '../../ducks/modal-serverfeil';
import FormikTekstArea from '../../components/formik/formik-tekstarea';
import FormikDatoVelger from '../../components/formik/formik-datovelger/formik-datovelger';
import {lagreHuskelapp} from './lagreHuskelapp';
import {endreHuskelapp} from './endreHuskelapp';
import {EksisterendeArbeidslisteVisning} from './EksisterendeArbeidslisteVisning';
import {resetHuskelappStatusAction} from '../../ducks/huskelapp';

interface Props {
    onModalClose: () => void;
    isModalOpen: boolean;
    huskelapp?: HuskelappModell;
    bruker: BrukerModell;
    arbeidsliste?: ArbeidslisteModell | null;
}

export const LagEllerEndreHuskelappModal = ({isModalOpen, onModalClose, huskelapp, bruker, arbeidsliste}: Props) => {
    const {enhetId} = usePortefoljeSelector(OversiktType.minOversikt);
    const huskelappStatus = useSelector((state: AppState) => state.huskelapp.status);
    const arbeidslisteStatus = useSelector((state: AppState) => state.arbeidsliste.status);
    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();
    return (
        <Modal
            className={classNames('LagEllerEndreHuskelappModal', {medEksisterendeArbeidsliste: !!arbeidsliste})}
            open={isModalOpen}
            onClose={() => {
                dispatch(resetHuskelappStatusAction());
                onModalClose();
            }}
        >
            <Modal.Content>
                <HuskelappModalHeader />
                <div className="huskelapp-modal-content">
                    <div>
                        <HuskelappInfoAlert />
                        <Formik
                            initialValues={{
                                frist: huskelapp?.frist ?? '',
                                kommentar: huskelapp?.kommentar ?? ''
                            }}
                            validateOnBlur={false}
                            onSubmit={async (values, formikHelpers) => {
                                if (!values.frist && !values.kommentar) {
                                    return formikHelpers.setErrors({
                                        frist: 'Du må legge til enten frist eller kommentar for å kunne lagre huskelappen',
                                        kommentar:
                                            'Du må legge til enten frist eller kommentar for å kunne lagre huskelappen'
                                    });
                                }
                                const arbeidslisteArray: ArbeidslisteDataModell[] = arbeidsliste
                                    ? [bruker].map(bruker => ({
                                          fnr: bruker.fnr,
                                          kommentar: bruker.arbeidsliste.kommentar ?? null,
                                          frist: bruker.arbeidsliste.frist,
                                          kategori: bruker.arbeidsliste.kategori
                                      }))
                                    : [];
                                try {
                                    if (huskelapp?.huskelappId) {
                                        await endreHuskelapp(
                                            dispatch,
                                            values,
                                            bruker,
                                            enhetId!!,
                                            onModalClose,
                                            huskelapp.huskelappId
                                        );
                                    } else {
                                        await lagreHuskelapp(
                                            dispatch,
                                            values,
                                            bruker,
                                            enhetId!!,
                                            onModalClose,
                                            arbeidslisteArray
                                        );
                                    }
                                } catch (error) {
                                    dispatch(visServerfeilModal());
                                }
                            }}
                        >
                            <Form id="lagEllerEndreHuskelappForm">
                                <FormikTekstArea name="kommentar" maxLengde={100} className="blokk-xs" />
                                <FormikDatoVelger name="frist" />
                            </Form>
                        </Formik>
                    </div>
                    {arbeidsliste && <EksisterendeArbeidslisteVisning arbeidsliste={arbeidsliste} />}
                </div>
                <div>
                    {huskelappStatus === Status.ERROR && (
                        <Alert variant="error">Kunne ikke lagre huskelapp for bruker</Alert>
                    )}
                    {arbeidslisteStatus === Status.ERROR && (
                        <Alert variant="error">Har lagret ny huskelapp, men kunne ikke slette arbeidsliste</Alert>
                    )}
                    <div className="huskelapp-handlingsknapper">
                        <Button
                            size="small"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                                dispatch(resetHuskelappStatusAction());
                                onModalClose();
                            }}
                        >
                            Avbryt
                        </Button>
                        <Button
                            variant="primary"
                            size="small"
                            type="submit"
                            loading={huskelappStatus === Status.PENDING}
                            form="lagEllerEndreHuskelappForm"
                        >
                            {arbeidsliste ? 'Lagre og slett eksisterende' : 'Lagre'}
                        </Button>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
};

import * as React from 'react';
import classNames from 'classnames/dedupe';
import {Innholdstittel, Normaltekst} from 'nav-frontend-typografi';
import './tilbakemelding-modal.less';
import {useState} from 'react';
import TilbakemeldingTakkModal from './tilbakemelding-takk-modal';
import {Textarea} from 'nav-frontend-skjema';
import {Hovedknapp} from 'nav-frontend-knapper';
import TilfredshetValg from './tilfredshet-valg';
import CheckboxValg from './checkbox-valg';

export interface Tilbakemelding {
    tilfredshet: number;
    kommentar: string;
}

export interface TilbakemeldingCheckboxProps {
    checkboxverdi: number[];
    kommentar: string;
}

interface TilbakemeldingModalProps {
    open: boolean;
    onTilbakemeldingSendt: (tilbakemelding: Tilbakemelding) => void;
    onTilbakemeldingCheckboxSendt: (tilbakemelding: TilbakemeldingCheckboxProps) => void;
    onIkkeVisIgjen: () => void;
}

function TilbakemeldingModal({open, onTilbakemeldingSendt, onTilbakemeldingCheckboxSendt}: TilbakemeldingModalProps) {
    const KOMMENTAR_MAX_CHAR = 750;
    const KOMMENTAR_ROWS = 5;

    const [kommentar, setKommentar] = useState('');
    const [harBlittVist, setHarBlittVist] = useState(false);
    const [harSendt, setHarSendt] = useState(false);
    const [tilfredshet, setTilfredshet] = useState(0);
    const [checkboxverdi, setCheckboxverdi] = useState<number[]>([]);
    const [feilmelding, setFeilmelding] = useState<string>('');

    const ikkeVisIgjen = false;
    const visTilfredshet = false;

    const handleFormSubmitted = e => {
        e.preventDefault();
        setHarSendt(true);
        onTilbakemeldingSendt({tilfredshet, kommentar});
    };

    const handleCheckboxFormSubmitted = e => {
        e.preventDefault();
        if (checkboxverdi.length === 0) {
            setFeilmelding('Velg minst en avkrysningsboks.');
        } else {
            setFeilmelding('');
            setHarSendt(true);
            onTilbakemeldingCheckboxSendt({
                checkboxverdi,
                kommentar
            });
        }
    };

    const handleTilfredshetChanged = (tilfredshet: number) => {
        setTilfredshet(tilfredshet);
    };

    const handleCheckboxverdiChanged = verdi => {
        setCheckboxverdi(verdi);
    };

    const handleKommentarChanged = e => {
        const value = e.target.value;

        if (value.length <= KOMMENTAR_MAX_CHAR) {
            setKommentar(value);
        }
    };

    if (open && !harBlittVist) {
        setHarBlittVist(true);
    }

    // Make sure that the animation will trigger when closing instead of returning null (no animation)
    if ((!open && !harBlittVist) || ikkeVisIgjen) {
        return null;
    }
    const harBesvartTilfredshet = tilfredshet > 0;
    const visFritekst = true;

    return (
        <div
            className={classNames(
                'tilbakemelding-modal',
                {'tilbakemelding-modal--slide-in': open},
                {'tilbakemelding-modal--slide-out': !open}
            )}
        >
            <div
                className={classNames('tilbakemelding-modal__innhold', {
                    'tilbakemelding-modal__innhold--takk': harSendt
                })}
                data-testid={harSendt ? 'tilbakemelding_modal_takk' : 'tilbakemelding_modal'}
            >
                {harSendt ? (
                    <TilbakemeldingTakkModal />
                ) : (
                    <>
                        <Innholdstittel className="blokk-xxs tilbakemelding-modal__tittel">
                            Meldekortopplysninger
                        </Innholdstittel>
                        <Normaltekst className="tilbakemelding-modal__ingress">
                            Hvilke opplysninger fra brukernes meldekort er viktigst for deg? Svarene er anonyme, og du
                            kan velge maks 4 opplysninger.
                        </Normaltekst>
                        {visTilfredshet ? (
                            <>
                                <div className="tilbakemelding-modal__tilfredshet">
                                    <TilfredshetValg
                                        className="blokk-xs"
                                        onTilfredshetChanged={handleTilfredshetChanged}
                                        defaultTilfredshet={tilfredshet}
                                    />
                                </div>
                                {harBesvartTilfredshet && (
                                    <form
                                        className="tilbakemelding-modal__ekspander"
                                        onSubmit={e => handleFormSubmitted(e)}
                                        data-widget="accessible-autocomplete"
                                    >
                                        {visFritekst && (
                                            <div className="tilbakemelding-modal__kommentar">
                                                <Textarea
                                                    className="tilbakemelding-modal__kommentar-felt"
                                                    label="Fortell gjerne litt mer om hvorfor."
                                                    rows={KOMMENTAR_ROWS}
                                                    maxLength={KOMMENTAR_MAX_CHAR}
                                                    value={kommentar}
                                                    onChange={handleKommentarChanged}
                                                    data-testid="tilfredshet_kommentarfelt"
                                                />
                                            </div>
                                        )}
                                        <Hovedknapp
                                            role="submit"
                                            className="knapp--hoved"
                                            data-testid="tilfredshet_send-knapp"
                                        >
                                            Send
                                        </Hovedknapp>
                                    </form>
                                )}
                            </>
                        ) : (
                            <form
                                className="tilbakemelding-modal__ekspander"
                                onSubmit={e => handleCheckboxFormSubmitted(e)}
                                data-widget="accessible-autocomplete"
                            >
                                <CheckboxValg onCheckboxChanged={handleCheckboxverdiChanged} />
                                <div className="tilbakemelding-modal__kommentar">
                                    <Textarea
                                        className="tilbakemelding-modal__kommentar-felt"
                                        label="Si gjerne litt mer om hvordan du bruker opplysningene i oppfølging. (Frivillig)"
                                        rows={KOMMENTAR_ROWS}
                                        maxLength={KOMMENTAR_MAX_CHAR}
                                        value={kommentar}
                                        onChange={handleKommentarChanged}
                                        data-testid="tilfredshet_kommentarfelt"
                                    />
                                </div>
                                <p className="tilbakemelding-modal__feilmelding" data-testid="tilfredshet_feilmelding">
                                    {feilmelding}
                                </p>
                                <Hovedknapp role="submit" className="knapp--hoved" data-testid="tilfredshet_send-knapp">
                                    Send
                                </Hovedknapp>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default TilbakemeldingModal;

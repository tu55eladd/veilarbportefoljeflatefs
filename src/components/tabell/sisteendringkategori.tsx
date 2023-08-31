import * as React from 'react';
import {RefObject, useRef, useState} from 'react';
import classnames from 'classnames';
import {BrukerModell} from '../../model-interfaces';
import '../../topp-meny/lenker.css';
import {hendelserLabels} from '../../filtrering/filter-konstanter';
import {getVeilarbpersonflateUrl} from '../../utils/url-utils';
import {BodyShort, Button, Popover} from '@navikt/ds-react';
import {settBrukerIKontekst} from '../../middleware/api';
import {useEventListener} from '../../hooks/use-event-listener';
import PopoverContent from '@navikt/ds-react/esm/popover/PopoverContent';
import {ReactComponent as XMarkOctagonIcon} from '../ikoner/x_mark_octagon_icon.svg';

interface SisteEndringKategoriProps {
    className?: string;
    bruker: BrukerModell;
    enhetId: string;
    skalVises: boolean;
}

export const oppdaterBrukerIKontekstOgNavigerTilLenke = (
    fnr: string,
    lenke: string,
    onSuksess: () => void,
    onFeilet: () => void
) => {
    settBrukerIKontekst(fnr)
        .then(() => {
            onSuksess();
            window.location.href = lenke;
        })
        .catch(onFeilet);
};

export const vedKlikkUtenfor = (refs: RefObject<HTMLElement>[], klikkTarget: Node | null, fn: () => void) => {
    if (!refs.some(ref => ref.current?.contains(klikkTarget))) {
        fn();
    }
};

function SisteEndringKategori({className, bruker, enhetId, skalVises}: SisteEndringKategoriProps) {
    const [laster, setLaster] = useState(false);
    const [harFeil, setHarFeil] = useState(false);
    const [linkPopoverApen, setLinkPopoverApen] = useState(false);

    const feilmeldingKnappRef = useRef<HTMLButtonElement>(null);
    const popoverContainerRef = useRef<HTMLDivElement>(null);

    useEventListener('mousedown', e =>
        vedKlikkUtenfor([feilmeldingKnappRef, popoverContainerRef], e.target, () => {
            if (harFeil) {
                setHarFeil(false);
            }
        })
    );

    const handterKlikk = () => {
        setHarFeil(false);
        setLaster(true);

        oppdaterBrukerIKontekstOgNavigerTilLenke(
            bruker.fnr,
            getVeilarbpersonflateUrl(`/aktivitet/vis/${bruker.sisteEndringAktivitetId}#visAktivitetsplanen`, enhetId),
            () => {
                setHarFeil(false);
                setLaster(false);
            },
            () => {
                setHarFeil(true);
                setLaster(false);
            }
        );
    };

    const sisteEndringKategori = !!bruker.sisteEndringKategori ? hendelserLabels[bruker.sisteEndringKategori] : ' ';

    if (!skalVises) {
        return null;
    }

    if (bruker.sisteEndringAktivitetId === undefined || bruker.sisteEndringAktivitetId === null) {
        return (
            <BodyShort size="small" className={className}>
                {sisteEndringKategori}
            </BodyShort>
        );
    }

    return (
        <div className={className}>
            <Button
                className={classnames('lenke lenke--frittstaende')}
                loading={laster}
                onClick={handterKlikk}
                size="xsmall"
                variant="tertiary"
            >
                <BodyShort size="small">{sisteEndringKategori}</BodyShort>
            </Button>
            {harFeil && (
                <>
                    <Button
                        className="juster-tekst-venstre"
                        variant="tertiary-neutral"
                        size="xsmall"
                        onClick={() => setLinkPopoverApen(true)}
                        ref={feilmeldingKnappRef}
                        icon={<XMarkOctagonIcon />}
                    >
                        Feil i baksystem
                    </Button>
                    <Popover
                        ref={popoverContainerRef}
                        anchorEl={feilmeldingKnappRef.current}
                        open={linkPopoverApen}
                        onClose={() => setLinkPopoverApen(false)}
                        placement="bottom"
                        strategy="fixed"
                    >
                        <PopoverContent>
                            Fikk ikke kontakt med baksystemet. <br /> Prøv å åpne aktivitetsplanen og søk opp personen.
                        </PopoverContent>
                    </Popover>
                </>
            )}
        </div>
    );
}

export default SisteEndringKategori;

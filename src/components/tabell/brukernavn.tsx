/* eslint-disable no-console */
// TODO ta bort igjen
import * as React from 'react';
import {BrukerModell} from '../../model-interfaces';
import {oppdaterBrukerIKontekstOgNavigerTilLenke} from '../../utils/utils';
import {getVeilarbpersonflateUrl} from '../../utils/url-utils';
import {AksjonKnappMedPopoverFeilmelding} from '../aksjon-knapp-med-popover-feilmelding/aksjon-knapp-med-popover-feilmelding';

interface BrukerNavnProps {
    className?: string;
    bruker: BrukerModell;
    enhetId: string;
}

const settSammenNavn = (bruker: BrukerModell) => {
    if (bruker.fornavn === '' && bruker.etternavn === '') {
        return null;
    }

    if (bruker.fornavn === '') {
        return bruker.etternavn;
    }

    if (bruker.etternavn === '') {
        return bruker.fornavn;
    }

    return `${bruker.etternavn}, ${bruker.fornavn}`;
};

const BrukerNavn = ({className, bruker, enhetId}: BrukerNavnProps) => {
    const navn = settSammenNavn(bruker);

    const handterKlikk = async () => {
        console.log('Brukernavn, handterKlikk.');
        setTimeout(() => {
            return oppdaterBrukerIKontekstOgNavigerTilLenke(bruker.fnr, getVeilarbpersonflateUrl(null, enhetId));
        }, 2000);
    };

    const handterKlikkNyFane = async () => {
        console.log('Brukernavn, handterKlikkNyFane.');
        setTimeout(() => {
            return oppdaterBrukerIKontekstOgNavigerTilLenke(bruker.fnr, getVeilarbpersonflateUrl(null, enhetId), true);
        }, 2000);
    };

    return (
        <div className={className}>
            {navn && (
                <AksjonKnappMedPopoverFeilmelding
                    klikkAksjon={handterKlikk}
                    ctrlklikkAksjon={handterKlikkNyFane}
                    knappStil="juster-tekst-venstre knapp-uten-padding"
                    knappTekst={navn}
                />
            )}
        </div>
    );
};

export default BrukerNavn;

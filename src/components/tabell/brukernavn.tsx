import * as React from 'react';
import classnames from 'classnames';
import { BrukerModell } from '../../model-interfaces';
import { setFraBrukerIUrl } from '../../utils/url-utils';

const settSammenNavn = (bruker) => {
    if (bruker.etternavn === '' && bruker.fornavn === '') {
        return '';
    }
    return `${bruker.etternavn}, ${bruker.fornavn}`;
};

const brukerNavn = (className, bruker, enhetId) => (
    <div className={className}>
        <a
            onClick={() => {
                setFraBrukerIUrl(bruker.fnr);
            }}
            href={`${window.location.origin}/veilarbpersonflatefs/${bruker.fnr}?enhet=${enhetId}`}
            className={classnames('lenke lenke--frittstaende ')}

        >
        {settSammenNavn(bruker)}
        </a>
    </div>
);

interface BrukerNavnProps {
    className?: string;
    bruker: BrukerModell;
    enhetId: string;
}

function BrukerNavn({ className, bruker, enhetId }: BrukerNavnProps) {
    return brukerNavn(className,bruker, enhetId);
}

export default BrukerNavn;

import React from 'react';
import { lagConfig } from './filter-konstanter';
import { ReactComponent as FilterIkon } from './filter-ikon.svg';
import { MouseEvent } from 'react';
import classNames from 'classnames';
import { InjectedIntl } from 'react-intl';

interface FiltreringLabelProps {
    label: string | { label: string };
    slettFilter: (event: MouseEvent<HTMLButtonElement>) => void;
    markert?: boolean;
    harMuligMenIkkeValgtKolonne?: boolean;
    skalHaKryssIkon?: boolean;
    intl: InjectedIntl;
}

function FiltreringLabel({label, slettFilter, harMuligMenIkkeValgtKolonne = false, markert = false, skalHaKryssIkon = true, intl}: FiltreringLabelProps) {
    const className = classNames('filtreringlabel__label', {'filtreringlabel-slett-filter': !skalHaKryssIkon});
    return (
        <button
            aria-label={skalHaKryssIkon ? intl.formatMessage({id:'filtrering.label.slett-filter'}) : intl.formatMessage({id:'filtrering.label.slett-alle-filter'})}
            className={classNames('filtreringlabel', 'typo-undertekst', {'filtreringlabel--markert': markert}, {'filtreringlabel--muligeKolonner': harMuligMenIkkeValgtKolonne})}
            onClick={slettFilter}>
            <span className={className}>{lagConfig(label).label}</span>
            {skalHaKryssIkon && <FilterIkon/>}
        </button>
    );
}

export default FiltreringLabel;

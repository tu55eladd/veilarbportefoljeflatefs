import * as React from 'react';
import './bar.less';
import {BodyShort, Label} from '@navikt/ds-react';

export interface BarlabelProps {
    labelTekst: React.ReactNode;
    antall?: number;
}

function Barlabel({labelTekst, antall}: BarlabelProps) {
    return (
        <>
            <BodyShort size="small" className="barlabel__labeltext">
                {labelTekst}
            </BodyShort>
            {(antall || antall === 0) && (
                <Label className="barlabel__antall" size="small">
                    {antall}
                </Label>
            )}
        </>
    );
}

export default Barlabel;

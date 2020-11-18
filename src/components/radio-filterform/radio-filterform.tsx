import React, {useState} from 'react';
import classNames from 'classnames';
import {Radio} from 'nav-frontend-skjema';
import './radio-filterform.less';
import {FiltervalgModell} from '../../model-interfaces';
import VelgLukkKnapp from '../velg-lukk-knapp';

interface ValgType {
    [key: string]: {label: string; className?: string};
}

interface RadioFilterformProps {
    filterId: string;
    endreFiltervalg: (form: string, filterVerdi: string) => void;
    closeDropdown: () => void;
    valg: ValgType;
    filtervalg: FiltervalgModell;
}

export function RadioFilterform({filterId, endreFiltervalg, closeDropdown, valg, filtervalg}: RadioFilterformProps) {
    const [valgtFilterValg, setValgteFilterValg] = useState<string>(filtervalg[filterId]);

    let reactKey = 1;
    return (
        <form
            className="skjema radio-filterform"
            onSubmit={e => {
                e.preventDefault();
                if (valgtFilterValg) {
                    endreFiltervalg(filterId, valgtFilterValg);
                }
                closeDropdown();
            }}
        >
            <div className="radio-filterform__valg">
                {Object.keys(valg).map(v => (
                    <Radio
                        key={reactKey++}
                        label={valg[v].label}
                        value={v}
                        name={valg[v].label}
                        className={valg[v].className}
                        checked={valgtFilterValg === v}
                        onChange={e => setValgteFilterValg(e.target.value)}
                    />
                ))}
            </div>
            <div className={classNames('radio-filterform__under-valg')}>
                <VelgLukkKnapp harValg={valgtFilterValg !== null} dataTestId="radio-filterform" />
            </div>
        </form>
    );
}

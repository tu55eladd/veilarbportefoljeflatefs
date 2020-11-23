import React, {useEffect, useState} from 'react';
import {Dictionary} from '../../utils/types/types';
import {FiltervalgModell} from '../../model-interfaces';
import AlertStripe from 'nav-frontend-alertstriper';
import './filterform.less';
import classNames from 'classnames';
import {Element} from 'nav-frontend-typografi';
import {utdanningBestatt, utdanningGodkjent} from '../../filtrering/filter-konstanter';
import VelgLukkKnapp from '../velg-lukk-knapp';
import NullstillValgKnapp from '../nullstill-valg-knapp';
import {useFeatureSelector} from '../../hooks/redux/use-feature-selector';
import {NULLSTILL_KNAPP} from '../../konstanter';

interface DoubleCheckboxFilterformProps {
    endreFiltervalg: (form: string, filterVerdi: string[]) => void;
    closeDropdown: () => void;
    filtervalg: FiltervalgModell;
    className?: string;
    emptyCheckboxFilterFormMessage?: string;
}

const formCol1 = 'utdanningGodkjent';
const formCol2 = 'utdanningBestatt';
const valgCol1 = utdanningGodkjent;
const valgCol2 = utdanningBestatt;
const harValgCol1 = Object.keys(valgCol1).length > 0;
const harValgCol2 = Object.keys(valgCol1).length > 0;

const uniqueValgCol1 = makeValgUnique(valgCol1, formCol1);
const uniqueValgCol2 = makeValgUnique(valgCol2, formCol2);

function DoubleCheckboxFilterform({
    endreFiltervalg,
    closeDropdown,
    filtervalg,
    className,
    emptyCheckboxFilterFormMessage
}: DoubleCheckboxFilterformProps) {
    const [checkBoxValgCol1, setCheckBoxValgCol1] = useState<string[]>(filtervalg[formCol1]);
    const [checkBoxValgCol2, setCheckBoxValgCol2] = useState<string[]>(filtervalg[formCol2]);
    const erNullstillFeatureTogglePa = useFeatureSelector()(NULLSTILL_KNAPP);

    useEffect(() => {
        setCheckBoxValgCol1(filtervalg[formCol1]);
    }, [filtervalg]);

    useEffect(() => {
        setCheckBoxValgCol2(filtervalg[formCol2]);
    }, [filtervalg]);

    const velgCheckBox = (e, typeForm) => {
        e.persist();
        const id = e.target.value.replace(`${typeForm}_`, '');
        if (typeForm === formCol1)
            return e.target.checked
                ? setCheckBoxValgCol1(prevState => [...prevState, id])
                : setCheckBoxValgCol1(prevState => prevState.filter(value => value !== id));
        else if (typeForm === formCol2)
            return e.target.checked
                ? setCheckBoxValgCol2(prevState => [...prevState, id])
                : setCheckBoxValgCol2(prevState => prevState.filter(value => value !== id));
        return;
    };

    const nullstillValg = () => {
        setCheckBoxValgCol1([]);
        setCheckBoxValgCol2([]);
        endreFiltervalg(formCol1, []);
        endreFiltervalg(formCol2, []);
    };

    return (
        <form
            className="skjema checkbox-filterform"
            onSubmit={e => {
                e.preventDefault();
                if (checkBoxValgCol1.length > 0 || checkBoxValgCol2.length > 0) {
                    endreFiltervalg(formCol1, checkBoxValgCol1);
                    endreFiltervalg(formCol2, checkBoxValgCol2);
                }
                closeDropdown();
            }}
        >
            {harValgCol1 && harValgCol2 && (
                <div className={classNames('checkbox-filterform__valg__double', className)}>
                    <div
                        className="checkbox-filterform-col1"
                        role="group"
                        aria-labelledby="double-filterform-label-col1"
                    >
                        <Element id="double-filterform-label-col1" className="double-form-title">
                            {'Er utdanningen godkjent i Norge?'}
                        </Element>
                        <RenderFields
                            valg={uniqueValgCol1}
                            form={formCol1}
                            velgCheckBox={e => velgCheckBox(e, formCol1)}
                            checkBoxValg={checkBoxValgCol1}
                        />
                    </div>
                    <div
                        className="checkbox-filterform-col2"
                        role="group"
                        aria-labelledby="double-filterform-label-col2"
                    >
                        <Element id="double-filterform-label-col2" className="double-form-title">
                            {'Er utdanningen bestått?'}
                        </Element>
                        <RenderFields
                            valg={uniqueValgCol2}
                            form={formCol2}
                            velgCheckBox={e => velgCheckBox(e, formCol2)}
                            checkBoxValg={checkBoxValgCol2}
                        />
                    </div>
                </div>
            )}
            <div
                className={
                    erNullstillFeatureTogglePa ? 'filterform__under-valg__nullstill-feature' : 'filterform__under-valg'
                }
            >
                <VelgLukkKnapp
                    harValg={checkBoxValgCol1.length > 0 || checkBoxValgCol2.length > 0}
                    dataTestId="double-checkbox-filterform"
                />
                {erNullstillFeatureTogglePa && (
                    <NullstillValgKnapp dataTestId="double-checkbox-filterform" nullstillValg={nullstillValg} />
                )}
                {(!harValgCol1 || !harValgCol2) && (
                    <AlertStripe type="info" className="checkbox-filterform__alertstripe">
                        {emptyCheckboxFilterFormMessage || 'Ingen veiledere funnet'}
                    </AlertStripe>
                )}
            </div>
        </form>
    );
}

function RenderFields(props: {
    valg: Dictionary<string>;
    form: string;
    velgCheckBox: (e) => void;
    checkBoxValg: string[];
}) {
    return (
        <>
            {Object.entries(props.valg).map(([filterKey, filterValue]) => (
                <div className="skjemaelement skjemaelement--horisontal" key={filterKey}>
                    <input
                        id={filterKey}
                        type="checkbox"
                        className="skjemaelement__input checkboks"
                        value={filterKey}
                        checked={props.checkBoxValg.includes(filterKey.replace(`${props.form}_`, ''))}
                        onChange={props.velgCheckBox}
                        data-testid={`filter_${filterKey}`}
                    />
                    <label htmlFor={filterKey} className="skjemaelement__label">
                        {filterValue}
                    </label>
                </div>
            ))}
        </>
    );
}

function makeValgUnique(valg: Dictionary<string>, form: string) {
    const unique = {};
    Object.entries(valg).forEach(([filterKey, filterValue]) => {
        const NEW_KEY = form + '_' + filterKey;
        unique[NEW_KEY] = filterValue;
    });
    return unique;
}

export default DoubleCheckboxFilterform;
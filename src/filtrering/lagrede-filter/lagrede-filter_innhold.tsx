import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Radio} from 'nav-frontend-skjema'
import RedigerKnapp from '../../components/knapper/rediger-knapp';
import {avmarkerLagretFilter, LagretFilter, velgLagretFilter,} from '../../ducks/lagret-filter';
import {AppState} from '../../reducer';
import {FiltervalgModell} from '../../model-interfaces';
import {lagredeFilterListerErLik} from "../../components/modal/lagrede-filter/lagrede-filter-utils";
import {finnSideNavn} from "../../middleware/metrics-middleware";
import {logEvent} from "../../utils/frontend-logger";
import {LagreFilterModal, Visningstype} from "../../components/modal/lagrede-filter/lagre-filter-modal";
import './lagrede-filter_innhold.less'

interface LagredeFilterInnholdProps {
    lagretFilter: LagretFilter[]
}

function LagredeFilterInnhold(props: LagredeFilterInnholdProps) {
    const outerDivRef = useRef<HTMLDivElement>(null);
    const className = (props.lagretFilter.length >= 18) ? 'lagrede-filter__valgfelt__lang' : 'lagrede-filter__valgfelt'

    const [visEndreFilterModal, setVisEndreFilterModal] = useState(false);
    const filtreringMinOversikt = useSelector((state: AppState) => state.filtreringMinoversikt);

    const dispatch = useDispatch();

    const valgtFilter = props.lagretFilter.find(elem => lagredeFilterListerErLik(elem.filterValg, filtreringMinOversikt));
    const finnLagretFilter = useCallback((filterId) => props.lagretFilter.find((elem) => elem.filterId === parseInt(filterId)),[props.lagretFilter]);

    const velgFilter = useCallback((filterId: string) => {
        const filterVerdi = finnLagretFilter(filterId);

        logEvent('portefolje.metrikker.lagredefilter.valgt-lagret-filter',
            {}, {filterId: filterVerdi!.filterId, sideNavn: finnSideNavn()});
        dispatch(velgLagretFilter(filterVerdi!));
    },[finnLagretFilter, dispatch]);

    useEffect(() => {
        valgtFilter
            ? velgFilter(valgtFilter.filterId.toString())
            : dispatch(avmarkerLagretFilter());
    }, [valgtFilter, dispatch, velgFilter]);

    return (
        <div className={className} ref={outerDivRef}>
            {props.lagretFilter.map((filter, idx) =>
                <LagretFilterRad
                    key={idx}
                    filter={filter}
                    onClickRedigerKnapp={() => setVisEndreFilterModal(true)}
                    hanterVelgFilter={(e) => {
                        velgFilter(e.target.value)
                    }}
                    filterState={filtreringMinOversikt}
                />
            )}
            <LagreFilterModal
                velgVisningstype={Visningstype.OPPDATER}
                isOpen={visEndreFilterModal}
                onRequestClose={() => setVisEndreFilterModal(false)}/>
        </div>
    );
}

interface LagretFilterRadProps {
    hanterVelgFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filter: LagretFilter;
    filterState: FiltervalgModell;
    onClickRedigerKnapp: () => void;
}

function LagretFilterRad({filter, hanterVelgFilter, onClickRedigerKnapp, filterState}: LagretFilterRadProps) {
    const erValgt = lagredeFilterListerErLik(filter.filterValg, filterState)

    useEffect(() => {
        if (erValgt) {
            logEvent('portefolje.metrikker.lagredefilter.valgt-lagret-filter', {},
                {filterId: filter.filterId, sideNavn: finnSideNavn()})
        }
    }, [erValgt, filter])

    return (
        <div className="lagrede-filter__rad">
            <Radio
                className="lagrede-filter__filternavn"
                key={filter.filterId}
                name="lagretFilter"
                label={filter.filterNavn}
                value={filter.filterId}
                onChange={hanterVelgFilter}
                checked={erValgt}
            />
            <RedigerKnapp
                hidden={!erValgt}
                aria="Rediger lagret filter"
                onClick={onClickRedigerKnapp}
            />
        </div>
    );
}

export default LagredeFilterInnhold;

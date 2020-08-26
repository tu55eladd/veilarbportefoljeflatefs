import React from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../reducer';
import LagredeFilterInnhold from "./lagrede-filter_innhold";
import {AlertStripeFeil} from "nav-frontend-alertstriper";
import {HandlingsType} from "../../ducks/lagret-filter";
import {STATUS} from "../../ducks/utils";

function FiltreringLagredeFilter(props: { filtergruppe: string }) {
    const lagretFilterState = useSelector((state: AppState) => state.lagretFilter);
    const lagretFilter = lagretFilterState.data;

    const sortering = () => {
        return lagretFilter.sort((a, b) => a.filterNavn.toLowerCase()
            .localeCompare(b.filterNavn.toLowerCase(), undefined, {numeric: true}));
    }

    return (
        <>
            {(lagretFilterState.handlingType === HandlingsType.HENTE
                && lagretFilterState.status === STATUS.ERROR)
                ? <AlertStripeFeil>
                    Det oppsto en feil, og mine filter kunne ikke hentes fram. Prøv igjen senere.
                </AlertStripeFeil>
                : <LagredeFilterInnhold lagretFilter={sortering()}
                                        filtergruppe={props.filtergruppe}/>}
        </>
    );
}

export default FiltreringLagredeFilter;

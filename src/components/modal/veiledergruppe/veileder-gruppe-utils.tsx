import { FiltervalgModell } from '../../../model-interfaces';

export const fjernVeiledereFraListen = (prevState: FiltervalgModell, veilederTarget: string) => prevState.veiledere
    ? {...prevState, veiledere: prevState.veiledere.filter(v => v !== veilederTarget)}
    : {...prevState, veiledere: []};

export function harGjortEndringerIFilterValg(redigertListe: string[], initialstateListe: string[]) {
    return !veilederlisterErLik(redigertListe, initialstateListe);
}

export function harGjortEndringerIGruppeNavn(gruppeNavn: string, initialGruppeNavn: string) {
    return gruppeNavn !== initialGruppeNavn;
}

export function harGjortEndringer(redigertListe: string[], initialstateListe: string[], gruppeNavn: string, initialGruppeNavn: string) {
    if (harGjortEndringerIGruppeNavn(gruppeNavn, initialGruppeNavn)) {
        return true;
    }
    return harGjortEndringerIFilterValg(redigertListe, initialstateListe);
}

export function veilederlisterErLik(lagretVeilederGruppe: string[], veiledereFilter: string[]) {
    return lagretVeilederGruppe.length === veiledereFilter.length && lagretVeilederGruppe.every((v) => veiledereFilter.includes(v));
}

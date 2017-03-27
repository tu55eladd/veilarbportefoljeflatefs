/* eslint-disable import/prefer-default-export*/
import queryString from 'query-string';

export function erDev() {
    const url = window.location.href;
    return url.includes('debug=true') || url.includes('devillo.no:9592')
        || url.includes('devillo.no:9593') || url.includes('localhost:');
}

export function range(start, end, inclusive = false) {
    return new Array((end - start) + ((inclusive) ? 1 : 0)).fill(0).map((_, i) => start + i);
}

export function lag2Sifret(n) {
    return n < 10 ? `0${n}` : `${n}`;
}

export function leggEnhetIUrl(enhet) { // eslint-disable-line consistent-return
    if (!enhet) return null;
    const parsed = queryString.parse(location.search);
    parsed.enhet = enhet;

    const stringified = queryString.stringify(parsed);
    const pathname = window.location.pathname;
    window.history.replaceState({}, null, `${pathname}?${stringified}`);
}

export function filterUrlBuilder(filtervalg) {
    let result = '';
    if (filtervalg === null || filtervalg === undefined) {
        return result;
    }

    if (filtervalg.nyeBrukere) {
        result += `&nyeBrukere=${filtervalg.nyeBrukere}`;
    }

    if (filtervalg.inaktiveBrukere) {
        result += `&inaktiveBrukere=${filtervalg.inaktiveBrukere}`;
    }

    if (filtervalg.alder && (filtervalg.alder > 0 && filtervalg.alder <= 8)) {
        result += `&alder=${filtervalg.alder}`;
    }

    if (filtervalg.kjonn && (filtervalg.kjonn === 'M' || filtervalg.kjonn === 'K')) {
        result += `&kjonn=${filtervalg.kjonn}`;
    }

    if (filtervalg.fodselsdagIMnd > 0 && filtervalg.fodselsdagIMnd <= 31) {
        result += `&fodselsdagIMnd=${filtervalg.fodselsdagIMnd}`;
    }
    return result;
}

export function ytelseFilterErAktiv(filtervalg) {
    const { ordinaereDagpenger, dagpengerUnderPermittering, aapMaxtid, aapUnntak } = filtervalg;
    return ordinaereDagpenger || dagpengerUnderPermittering || aapMaxtid || aapUnntak;
}

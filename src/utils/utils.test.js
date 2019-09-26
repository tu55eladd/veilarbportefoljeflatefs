import 'babel-polyfill';
import { nesteUtlopsdatoEllerNull, utledValgteAktivitetsTyper, utlopsdatoUker } from './utils';

describe('Date utils', () => {
    describe('Utlopsdato aktiviteter', () => {
        it('finn neste utlopsdato', () => {
            const nesteDatoString = '2050-08-20T13:22:00Z';
            const utlopsdatoer = { a1: nesteDatoString, a2: '2050-08-21T13:22:00Z' };
            const nesteUtlopsdato = nesteUtlopsdatoEllerNull(utlopsdatoer);
            expect(nesteUtlopsdato.toUTCString()).toBe(new Date(nesteDatoString).toUTCString());
        });
        it('skal returnere null om ingen datoer finnes', () => {
            // eslint-disable-next-line no-unused-expressions
            expect(!!nesteUtlopsdatoEllerNull({})).toBeFalsy();
        });
        it('skal returnere null dersom dato er null', () => {
            // eslint-disable-next-line no-unused-expressions
            expect(!!nesteUtlopsdatoEllerNull({ a: null })).toBeFalsy();
        });
        it('skal returnere nyeste dato dersom én er null', () => {
            const nesteDatoString = '2050-08-20T13:22:00Z';
            const utlopsdatoer = { a1: nesteDatoString, a2: null };
            const nesteUtlopsdato = nesteUtlopsdatoEllerNull(utlopsdatoer);
            expect(nesteUtlopsdato.toUTCString()).toBe(new Date(nesteDatoString).toUTCString());
        });
    });

    describe('Utledning av valgte aktiviteter', () => {
        it('skal utlede navn på valg aktivitet', () => {
            const aktivitetFiltervalg = { a1: 'NEI', a2: 'JA', a3: 'NA' };
            const brukerAktiviteter = {
                a1: '2050-08-20T13:22:00Z',
                a2: '2050-08-21T13:22:00Z',
                a3: '2050-08-22T13:22:00Z',
                a4: '2050-08-23T13:22:00Z'
            };
            expect(utledValgteAktivitetsTyper(brukerAktiviteter, aktivitetFiltervalg)).toStrictEqual({ a2: '2050-08-21T13:22:00Z' });
        });
        it('skal returnere null om objekter er tomt eller null', () => {
            expect(utledValgteAktivitetsTyper(null, null)).toBeNull();
            expect(utledValgteAktivitetsTyper({}, {})).toBeNull();
        });
        it('skal returnere null dersom ingen har status JA', () => {
            const aktivitetFiltervalg = { a1: 'NEI', a2: 'NA', a3: 'NA' };
            expect(utledValgteAktivitetsTyper(null, aktivitetFiltervalg)).toBeNull();
        });
    });

    describe('utlopsdatoUker', () => {
        it('skal håndtere null verdier', () => {
            expect(utlopsdatoUker(null)).toBeUndefined();
            expect(utlopsdatoUker(undefined)).toBeUndefined();
            expect(utlopsdatoUker('ikke gyldig datostreng')).toBeUndefined();
        });

        it('skal regne ut antall uker', () => {
            const uker = 7 * 24 * 3600 * 1000;
            const now = new Date().getTime();
            const fremtiden = new Date(now + (2 * uker));
            const fortiden = new Date(now - (2 * uker));

            expect(utlopsdatoUker(`${fremtiden}`)).toBe(2);
            expect(utlopsdatoUker(`${fortiden}`)).toBe(-2);
        });
    });
});
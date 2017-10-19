/* eslint-disable */
import { MOCK_CONFIG, mock, delayed, respondWith, randomFailure } from './utils';
import enheter from './enheter';
import me from './me';
import brukere from './portefolje';
import veiledere from './veiledere';
import statustall from './statustall';
import tekster from './tekster';
import tiltak from './tiltak';
import lagPortefoljeStorrelser from './portefoljestorrelser';

function lagPortefoljeForVeileder(queryParams, bodyParams, alleBrukere) {
    const enhetportefolje = lagPortefolje(queryParams, bodyParams, enheter.enhetliste[0].enhetId, alleBrukere);
    enhetportefolje.brukere.forEach((bruker) => bruker.veilederId = me.ident);
    return enhetportefolje;
}

function lagPortefolje(queryParams, bodyParams, enhet, alleBrukere) {
    const { fra, antall } = queryParams;
    const fraInt = parseInt(fra, 10);
    const antallInt = parseInt(antall, 10);
    const filtrerteBrukere = alleBrukere.splice(fraInt, antallInt);

    return {
        enhet,
        antallTotalt: alleBrukere.length,
        antallReturnert: filtrerteBrukere.length,
        fraIndex: parseInt(queryParams.fra, 10),
        brukere: filtrerteBrukere
    };
}

// Hvis du vil hente tekster fra applikasjonen, så la linjen nedenfor være kommentert ut.
mock.get('/veilarbportefoljeflatefs/tjenester/tekster', respondWith(tekster));

// veileder-api
mock.get('/veilarbveileder/tjenester/veileder/enheter', respondWith(enheter));
mock.get('/veilarbveileder/tjenester/veileder/me', respondWith(me));
mock.get('express:/veilarbveileder/tjenester/enhet/:enhet/veiledere', respondWith(veiledere));

// portefolje-api
mock.get('express:/veilarbportefolje/api/enhet/:enhet/statustall', respondWith(delayed(1000, randomFailure(statustall))));
mock.post('express:/veilarbportefolje/api/enhet/:enhet/portefolje*', respondWith((url, config, { queryParams, bodyParams, extra }) => lagPortefolje(queryParams, bodyParams, extra.enhet, brukere)));
mock.get('express:/veilarbportefolje/api/enhet/:enhet/portefoljestorrelser*', respondWith(() => lagPortefoljeStorrelser()));
mock.post('express:/veilarbportefolje/api/veileder/:ident/portefolje*', respondWith((url, config, { queryParams, bodyParams, extra }) => lagPortefoljeForVeileder(queryParams, bodyParams, brukere)));
mock.get('express:/veilarbportefolje/tjenester/veileder/:veileder/statustall*', respondWith(delayed(1000, randomFailure(statustall))));
mock.get('express:/veilarbportefolje/api/enhet/:enhet/tiltak', () => respondWith(tiltak));

// situasjon-api
mock.post('/veilarbsituasjon/api/tilordneveileder/', respondWith(delayed(1000, randomFailure({ feilendeTilordninger: ['11111111111','22222222222'] }))));

// arbeidsliste-api
mock.post('/veilarbportefolje/tjenester/arbeidsliste/', respondWith(delayed(1000, randomFailure({ error: ['111111111111', '222222222222'], data: [] }))));
mock.put('/veilarbportefolje/tjenester/arbeidsliste/', respondWith(delayed(1000, randomFailure({ error: ['111111111111', '222222222222'] }))));
mock.delete('/veilarbportefolje/tjenester/arbeidsliste/', respondWith(delayed(1000, { aktoerIds: ['111111111111', '222222222222'] })));
mock.post('/veilarbportefolje/tjenester/arbeidsliste/delete', respondWith(delayed(1000, randomFailure({ error: ['111111111111', '222222222222'], data: [] }))));

mock.mock('*', respondWith((url, config) => mock.realFetch.call(window, url, config)));

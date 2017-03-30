import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Innholdslaster from '../innholdslaster/innholdslaster';
import {
    hentPortefoljeForVeileder,
    settSortering,
    settBrukerSomMarkert,
    nullstillFeilendeTilordninger,
    markerAlleBrukere
} from '../ducks/portefolje';
import Paginering from '../paginering/paginering';
import { enhetShape, veilederShape } from './../proptype-shapes';
import { eksporterVeilederportefoljeTilLocalStorage } from '../ducks/utils';
import { leggEnhetIUrl, ytelseFilterErAktiv } from '../utils/utils';

const settSammenNavn = (bruker) => {
    if (bruker.etternavn === '' && bruker.fornavn === '') {
        return '';
    }
    return `${bruker.etternavn}, ${bruker.fornavn}`;
};

class VeilederPortefoljeVisning extends Component {
    componentWillMount() {
        const { sorteringsrekkefolge, sorteringsfelt, hentPortefolje, valgtEnhet, veileder } = this.props;
        hentPortefolje(valgtEnhet.enhet.enhetId, veileder, sorteringsrekkefolge, sorteringsfelt);
        leggEnhetIUrl(valgtEnhet.enhet.enhetId);
        this.settSorteringNavnOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this, 'etternavn');
    }
    componentDidMount() {
        const { valgtEnhet, veileder } = this.props;
        eksporterVeilederportefoljeTilLocalStorage(veileder, valgtEnhet.enhet, location.pathname);
    }

    settSorteringOgHentPortefolje(felt) {
        const {
            sorteringsrekkefolge,
            sorteringsfelt,
            settSortering, // eslint-disable-line no-shadow
            fraIndex,
            hentPortefolje,
            veileder,
            valgtEnhet
        } = this.props;
        let valgtRekkefolge = '';
        if (felt !== sorteringsfelt) {
            valgtRekkefolge = 'ascending';
        } else {
            valgtRekkefolge = sorteringsrekkefolge === 'ascending' ? 'descending' : 'ascending';
        }
        settSortering(valgtRekkefolge, felt);
        hentPortefolje(valgtEnhet.enhet.enhetId, veileder, valgtRekkefolge, felt, fraIndex);
    }


    render() {
        const {
            portefolje,
            hentPortefolje,
            veileder,
            sorteringsrekkefolge,
            sorteringsfelt,
            valgtEnhet,
            settMarkert,
            clearFeilendeTilordninger,
            settSomMarkertAlle,
            filtervalg
        } = this.props;

        const { antallTotalt, antallReturnert, fraIndex, brukere } = portefolje.data;

        const sorterEtternavn = portefolje.sorteringsfelt === 'etternavn';

        const pagineringTekst = (
            antallTotalt > 0 ?
                (<FormattedMessage
                    id="enhet.portefolje.paginering.tekst"
                    values={{ fraIndex: `${fraIndex + 1}`, tilIndex: fraIndex + antallReturnert, antallTotalt }}
                />) :
                <FormattedMessage id="enhet.portefolje.paginering.ingen.brukere.tekst" />
        );

        const feil = portefolje.feilendeTilordninger;
        if (feil && feil.length > 0) {
            const fnr = feil.map((b) => b.brukerFnr).toString();
            // TODO en alert???
            alert(`Tilordning av veileder feilet brukere med fnr:${fnr}`); // eslint-disable-line no-undef
            clearFeilendeTilordninger();
        }

        const alleMarkert = brukere.length > 0 && brukere.every((bruker) => bruker.markert);
        const utlopsdatoHeader = !!filtervalg && ytelseFilterErAktiv(filtervalg.ytelse) ?
            (<th>
                <FormattedMessage id="portefolje.tabell.utlopsdato" />
            </th>)
            :
            null;

        return (
            <Innholdslaster avhengigheter={[portefolje]}>
                <Paginering
                    antallTotalt={antallTotalt}
                    fraIndex={fraIndex}
                    hentListe={(fra, antall) =>
                        hentPortefolje(valgtEnhet.enhet.enhetId, veileder,
                            sorteringsrekkefolge, sorteringsfelt, fra, antall)}
                    tekst={pagineringTekst}
                    sideStorrelse={20}
                />
                <table className="tabell portefolje-tabell typo-undertekst">
                    <thead className="extra-head">
                        <tr>
                            <th />
                            <th>Bruker</th>
                            <th />
                            <th />
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th>
                                <div className="skjema__input">
                                    <input
                                        className="checkboks"
                                        id="checkbox-alle-brukere"
                                        type="checkbox"
                                        checked={alleMarkert}
                                        onClick={() => settSomMarkertAlle(!alleMarkert)}
                                    />
                                    <label className="skjema__label" htmlFor="checkbox-alle-brukere" />
                                </div>
                            </th>
                            <th>
                                <button
                                    onClick={this.settSorteringNavnOgHentPortefolje}
                                    role="button"
                                    className={classNames('sortering-link', { valgt: sorterEtternavn })}
                                    aria-pressed={sorterEtternavn}
                                    aria-label={sorterEtternavn && sorteringsrekkefolge !== 'ikke_satt' ?
                                        sorteringsrekkefolge : 'inaktiv'}
                                >
                                    <FormattedMessage id="portefolje.tabell.navn" />
                                </button>
                            </th>
                            {utlopsdatoHeader}
                            <th>
                                <FormattedMessage id="portefolje.tabell.fodselsnummer" />
                            </th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {brukere.filter((b) => b.veilederId === veileder.ident)
                                .map((bruker) => <tr key={bruker.fnr}>
                                    <td>
                                        <div className="skjema__input">
                                            <input
                                                className="checkboks"
                                                id={`checkbox-${bruker.fnr}`}
                                                type="checkbox"
                                                checked={bruker.markert}
                                                onClick={() => settMarkert(bruker.fnr, !bruker.markert)}
                                            />
                                            <label className="skjema__label" htmlFor={`checkbox-${bruker.fnr}`} />
                                        </div>
                                    </td>
                                    <th>
                                        <a
                                            href={`https://${window.location.hostname}` +
                                            `/veilarbpersonflatefs/${bruker.fnr}?enhet=${valgtEnhet.enhet.enhetId}`}
                                            className="til-bruker-link"
                                        >
                                            {settSammenNavn(bruker)}
                                        </a>
                                    </th>
                                    {bruker.fnr !== null ?
                                        <td className="fodselsnummer-td">{bruker.fnr}</td> :
                                        <td className="ny-bruker-td"><span className="ny-bruker">Ny bruker</span></td>
                                    }
                                    <td className="sikkerhetstiltak-td">
                                        {bruker.sikkerhetstiltak.length > 0 ?
                                            <span className="sikkerhetstiltak">Sikkerhetstiltak</span> : null}
                                        {bruker.diskresjonskode !== null ?
                                            <span className="diskresjonskode">
                                                {`Kode ${bruker.diskresjonskode}`}
                                            </span> :
                                            null}
                                        {bruker.egenAnsatt === true ?
                                            <span className="egen-ansatt">Egen ansatt</span> : null}
                                        {bruker.erDoed === true ?
                                            <span className="etikett etikett--fokus">Død</span> : null}
                                    </td>
                                </tr>)}
                    </tbody>
                </table>
            </Innholdslaster>
        );
    }

}

VeilederPortefoljeVisning.propTypes = {
    portefolje: PT.shape({
        data: PT.shape({
            brukere: PT.arrayOf(PT.object).isRequired,
            antallTotalt: PT.number.isRequired,
            antallReturnert: PT.number.isRequired,
            fraIndex: PT.number.isRequired
        }).isRequired,
        sorteringsrekkefolge: PT.string.isRequired
    }).isRequired,
    valgtEnhet: enhetShape.isRequired,
    veileder: veilederShape.isRequired,
    hentPortefolje: PT.func.isRequired,
    settSortering: PT.func.isRequired,
    sorteringsrekkefolge: PT.string.isRequired,
    sorteringsfelt: PT.string.isRequired,
    fraIndex: PT.number,
    settMarkert: PT.func.isRequired,
    clearFeilendeTilordninger: PT.func.isRequired,
    settSomMarkertAlle: PT.func.isRequired,
    filtervalg: PT.object
};

const mapStateToProps = (state) => ({
    portefolje: state.portefolje,
    valgtEnhet: state.enheter.valgtEnhet,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    sorteringsfelt: state.portefolje.sorteringsfelt,
    filtervalg: state.filtrering
});

const mapDispatchToProps = (dispatch) => ({
    hentPortefolje: (enhet, ident, rekkefolge, felt, fra = 0, antall = 20, filtervalg) =>
        dispatch(hentPortefoljeForVeileder(enhet, ident, rekkefolge, felt, fra, antall, filtervalg)),
    settSortering: (rekkefolge, felt) => dispatch(settSortering(rekkefolge, felt)),
    settMarkert: (fnr, markert) => dispatch(settBrukerSomMarkert(fnr, markert)),
    clearFeilendeTilordninger: () => dispatch(nullstillFeilendeTilordninger()),
    settSomMarkertAlle: (markert) => dispatch(markerAlleBrukere(markert))
});

export default connect(mapStateToProps, mapDispatchToProps)(VeilederPortefoljeVisning);

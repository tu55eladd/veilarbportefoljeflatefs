import React from 'react';
import SorteringHeader from '../components/tabell/sortering-header';
import {
    DAGPENGER_YTELSE,
    DAGPENGER_YTELSE_LONNSGARANTIMIDLER,
    DAGPENGER_YTELSE_ORDINARE,
    DAGPENGER_YTELSE_PERMITTERING,
    DAGPENGER_YTELSE_PERMITTERING_FISKEINDUSTRI,
    I_AVTALT_AKTIVITET,
    MOTER_IDAG,
    TILTAKSHENDELSER,
    UNDER_VURDERING,
    UTLOPTE_AKTIVITETER,
    VENTER_PA_SVAR_FRA_BRUKER,
    VENTER_PA_SVAR_FRA_NAV,
    ytelseAapSortering,
    ytelseUtlopsSortering
} from '../filtrering/filter-konstanter';
import {FiltervalgModell, Sorteringsfelt, Sorteringsrekkefolge} from '../model-interfaces';
import {Kolonne} from '../ducks/ui/listevisning';
import {AktiviteterValg} from '../ducks/filtrering';
import Header from '../components/tabell/header';
import VelgalleCheckboks from '../components/toolbar/velgalle-checkboks';
import './enhetsportefolje.css';
import './brukerliste.css';
import {OrNothing} from '../utils/types/types';
import {useFeatureSelector} from '../hooks/redux/use-feature-selector';
import {VIS_AAP_VURDERINGSFRISTKOLONNER} from '../konstanter';

function harValgteAktiviteter(aktiviteter) {
    if (aktiviteter && Object.keys(aktiviteter).length > 0) {
        const valgteAktiviteter = Object.values(aktiviteter).filter(
            aktivitetvalg => aktivitetvalg !== AktiviteterValg.NA
        );
        return valgteAktiviteter?.length > 0;
    }
    return false;
}

interface EnhetListehodeProps {
    sorteringsrekkefolge: OrNothing<Sorteringsrekkefolge>;
    sorteringOnClick: (sortering: string) => void;
    valgteKolonner: Kolonne[];
    filtervalg: FiltervalgModell;
    sorteringsfelt: OrNothing<Sorteringsfelt>;
}

function EnhetListehode({
    sorteringsrekkefolge,
    sorteringOnClick,
    filtervalg,
    sorteringsfelt,
    valgteKolonner
}: EnhetListehodeProps) {
    const vis_kolonner_for_vurderingsfrist_aap = useFeatureSelector()(VIS_AAP_VURDERINGSFRISTKOLONNER);
    const {ytelse} = filtervalg;
    const erAapYtelse = Object.keys(ytelseAapSortering).includes(ytelse!);
    const aapPeriodetype = erAapYtelse ? ytelseAapSortering[ytelse!].periodetype : '';
    const aapVurderingsfrist = erAapYtelse ? ytelseAapSortering[ytelse!].vurderingsfrist : '';
    const aapVedtakssperiode = erAapYtelse ? ytelseAapSortering[ytelse!].vedtaksperiode : '';
    const aapRettighetsperiode = erAapYtelse ? ytelseAapSortering[ytelse!].rettighetsperiode : '';
    const erDagpengerYtelse = [
        DAGPENGER_YTELSE,
        DAGPENGER_YTELSE_ORDINARE,
        DAGPENGER_YTELSE_PERMITTERING,
        DAGPENGER_YTELSE_PERMITTERING_FISKEINDUSTRI,
        DAGPENGER_YTELSE_LONNSGARANTIMIDLER
    ].some(y => y === ytelse!);
    const ytelseUtlopsdatoNavn = ytelseUtlopsSortering[ytelse!];
    const ferdigfilterListe = filtervalg ? filtervalg.ferdigfilterListe : '';
    const iAvtaltAktivitet =
        !!ferdigfilterListe?.includes(I_AVTALT_AKTIVITET) && valgteKolonner.includes(Kolonne.AVTALT_AKTIVITET);

    const avansertAktivitet =
        harValgteAktiviteter(filtervalg.aktiviteter) && valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET);

    const forenkletAktivitet =
        harValgteAktiviteter(filtervalg.aktiviteterForenklet) && valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET);

    const tiltaksType =
        harValgteAktiviteter(filtervalg.tiltakstyper) && valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET);

    return (
        <div className="brukerliste__header brukerliste__sorteringheader">
            <VelgalleCheckboks />
            <div className="brukerliste__innhold" data-testid="brukerliste_innhold">
                <SorteringHeader
                    sortering={Sorteringsfelt.ETTERNAVN}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ETTERNAVN}
                    tekst="Etternavn"
                    className="col col-xs-2"
                    title="Etternavn"
                    headerId="etternavn"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.FODSELSNUMMER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.FODSELSNUMMER}
                    tekst="Fødselsnr."
                    className="col col-xs-2-5"
                    title="Fødselsnummer"
                    headerId="fnr"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.FODELAND}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.FODELAND}
                    tekst="Fødeland"
                    className="col col-xs-2"
                    title="Fødeland"
                    headerId="fodeland"
                    skalVises={valgteKolonner.includes(Kolonne.FODELAND)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.STATSBORGERSKAP}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.STATSBORGERSKAP}
                    tekst="Statsborgerskap"
                    className="col col-xs-2"
                    title="Statsborgerskap"
                    headerId="statsborgerskap"
                    skalVises={valgteKolonner.includes(Kolonne.STATSBORGERSKAP)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.STATSBORGERSKAP_GYLDIG_FRA}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.STATSBORGERSKAP_GYLDIG_FRA}
                    tekst="Gyldig fra"
                    className="col col-xs-2"
                    title="Statsborgerskap gyldig fra"
                    headerId="statsborgerskap_gyldig_fra"
                    skalVises={valgteKolonner.includes(Kolonne.STATSBORGERSKAP_GYLDIG_FRA)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.BOSTED_KOMMUNE}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.BOSTED_KOMMUNE}
                    tekst="Bosted"
                    headerId="bosted_kommune"
                    className="col col-xs-2"
                    skalVises={valgteKolonner.includes(Kolonne.BOSTED_KOMMUNE)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.BOSTED_BYDEL}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.BOSTED_BYDEL}
                    tekst="Bosted detaljer"
                    headerId="bosted_bydel"
                    className="col col-xs-2"
                    skalVises={valgteKolonner.includes(Kolonne.BOSTED_BYDEL)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.BOSTED_SIST_OPPDATERT}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.BOSTED_SIST_OPPDATERT}
                    tekst="Bosted sist oppdatert"
                    headerId="bosted_sist_oppdatert"
                    className="col col-xs-2"
                    skalVises={valgteKolonner.includes(Kolonne.BOSTED_SIST_OPPDATERT)}
                />
                <Header
                    className="col col-xs-2"
                    title="Tolkebehov"
                    headerId="tolkebehov"
                    skalVises={valgteKolonner.includes(Kolonne.TOLKEBEHOV)}
                >
                    Tolkebehov
                </Header>
                <SorteringHeader
                    sortering={Sorteringsfelt.TOLKE_SPRAAK}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.TOLKE_SPRAAK}
                    className="col col-xs-2"
                    title="Tolk behov språk"
                    tekst="Språk"
                    headerId="tolkespraak"
                    skalVises={valgteKolonner.includes(Kolonne.TOLKEBEHOV_SPRAAK)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.TOLKEBEHOV_SIST_OPPDATERT}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.TOLKEBEHOV_SIST_OPPDATERT}
                    tekst="Sist oppdatert"
                    className="col col-xs-2"
                    title="Tolkebehov sist oppdatert"
                    headerId="tolkbehovsistoppdatert"
                    skalVises={valgteKolonner.includes(Kolonne.TOLKEBEHOV_SIST_OPPDATERT)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.OPPFOLGINGSTARTET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.OPPFOLGINGSTARTET}
                    tekst="Oppfølging startet"
                    className="col col-xs-2"
                    skalVises={valgteKolonner.includes(Kolonne.OPPFOLGINGSTARTET)}
                    title="Startdato for pågående oppfølgingsperiode"
                    headerId="oppfolging-startet"
                />
                <Header
                    className="col col-xs-2"
                    skalVises={valgteKolonner.includes(Kolonne.VEILEDER)}
                    headerId="veileder"
                >
                    Veileder
                </Header>
                <SorteringHeader
                    sortering={Sorteringsfelt.NAVIDENT}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.NAVIDENT}
                    tekst="NAV-ident"
                    skalVises={valgteKolonner.includes(Kolonne.NAVIDENT)}
                    className="header__veilederident col col-xs-2"
                    title="NAV-ident på tildelt veileder"
                    headerId="navident"
                />
                <SorteringHeader
                    sortering={ytelseUtlopsdatoNavn}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={ytelseUtlopsdatoNavn === sorteringsfelt}
                    tekst="Gjenstående uker rettighet dagpenger"
                    skalVises={
                        erDagpengerYtelse && valgteKolonner.includes(Kolonne.GJENSTAENDE_UKER_RETTIGHET_DAGPENGER)
                    }
                    className="col col-xs-2"
                    title="Gjenstående uker av rettighetsperioden for dagpenger"
                    headerId="ytelse-utlopsdato"
                />
                <SorteringHeader
                    sortering={ytelseUtlopsdatoNavn}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={ytelseUtlopsdatoNavn === sorteringsfelt}
                    tekst="Gjenstående uker vedtak tiltakspenger"
                    skalVises={
                        !!filtervalg.ytelse &&
                        !erAapYtelse &&
                        !erDagpengerYtelse &&
                        valgteKolonner.includes(Kolonne.GJENSTAENDE_UKER_VEDTAK_TILTAKSPENGER)
                    }
                    className="col col-xs-2"
                    title="Gjenstående uker på gjeldende vedtak tiltakspenger"
                    headerId="ytelse-utlopsdato"
                />
                {vis_kolonner_for_vurderingsfrist_aap && (
                    <SorteringHeader
                        sortering={aapPeriodetype}
                        onClick={sorteringOnClick}
                        rekkefolge={sorteringsrekkefolge}
                        erValgt={sorteringsfelt === aapPeriodetype}
                        tekst="Type AAP-periode"
                        skalVises={erAapYtelse && valgteKolonner.includes(Kolonne.TYPE_YTELSE)}
                        className="col col-xs-2"
                        title="Type AAP-periode"
                        headerId="type-aap"
                    />
                )}
                {vis_kolonner_for_vurderingsfrist_aap && (
                    <SorteringHeader
                        sortering={aapVurderingsfrist}
                        onClick={sorteringOnClick}
                        rekkefolge={sorteringsrekkefolge}
                        erValgt={sorteringsfelt === aapVurderingsfrist}
                        tekst="Frist vurdering rett AAP"
                        skalVises={erAapYtelse && valgteKolonner.includes(Kolonne.VURDERINGSFRIST_YTELSE)}
                        className="col col-xs-2"
                        title="Omtrentlig frist for ny vurdering av AAP"
                        headerId="frist-vurdering-aap"
                    />
                )}
                <SorteringHeader
                    sortering={aapVedtakssperiode}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === aapVedtakssperiode}
                    tekst="Gjenstående uker vedtak AAP"
                    skalVises={erAapYtelse && valgteKolonner.includes(Kolonne.VEDTAKSPERIODE)}
                    className="col col-xs-2"
                    title="Gjenstående uker på gjeldende vedtak AAP"
                    headerId="gjenstaende-uker-vedtak-aap"
                />
                <SorteringHeader
                    sortering={aapRettighetsperiode}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === aapRettighetsperiode}
                    tekst="Gjenstående uker rettighet AAP"
                    skalVises={erAapYtelse && valgteKolonner.includes(Kolonne.RETTIGHETSPERIODE)}
                    className="col col-xs-2"
                    title="Gjenstående uker av rettighetsperioden for AAP"
                    headerId="rettighetsperiode-gjenstaende"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.VENTER_PA_SVAR_FRA_NAV}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VENTER_PA_SVAR_FRA_NAV}
                    tekst="Dato på melding"
                    skalVises={
                        !!ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_NAV) &&
                        valgteKolonner.includes(Kolonne.VENTER_SVAR)
                    }
                    className="col col-xs-2"
                    title='Dato på meldingen som er merket "Venter på svar fra NAV"'
                    headerId="venter-pa-svar-fra-nav"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.VENTER_PA_SVAR_FRA_BRUKER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VENTER_PA_SVAR_FRA_BRUKER}
                    tekst="Dato på melding"
                    skalVises={
                        !!ferdigfilterListe?.includes(VENTER_PA_SVAR_FRA_BRUKER) &&
                        valgteKolonner.includes(Kolonne.VENTER_SVAR)
                    }
                    className="col col-xs-2"
                    title='Dato på meldingen som er merket "Venter på svar fra bruker"'
                    headerId="venter-pa-svar-fra-bruker"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.UTLOPTE_AKTIVITETER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.UTLOPTE_AKTIVITETER}
                    tekst="Utløpsdato aktivitet"
                    skalVises={
                        !!ferdigfilterListe?.includes(UTLOPTE_AKTIVITETER) &&
                        valgteKolonner.includes(Kolonne.UTLOPTE_AKTIVITETER)
                    }
                    className="col col-xs-2"
                    title='Utløpsdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="utlopte-aktiviteter"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.I_AVTALT_AKTIVITET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.I_AVTALT_AKTIVITET}
                    tekst="Neste utløpsdato aktivitet"
                    skalVises={iAvtaltAktivitet}
                    className="col col-xs-2"
                    title='Neste utløpsdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="i-avtalt-aktivitet"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.VALGTE_AKTIVITETER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.VALGTE_AKTIVITETER}
                    tekst="Neste utløpsdato valgt aktivitet"
                    skalVises={avansertAktivitet || forenkletAktivitet || tiltaksType}
                    className="col col-xs-2"
                    title='Neste utløpsdato på avtalt aktivitet under "Planlegger" eller "Gjennomfører"'
                    headerId="valgte-aktiviteter"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.MOTER_IDAG}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.MOTER_IDAG}
                    tekst="Klokkeslett møte"
                    skalVises={!!ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_IDAG)}
                    className="col col-xs-2"
                    title="Tidspunktet møtet starter"
                    headerId="moter-idag"
                />
                <Header
                    skalVises={
                        !!ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTER_VARIGHET)
                    }
                    className="col col-xs-2"
                    title="Varighet på møtet"
                    headerId="varighet-mote"
                >
                    Varighet møte
                </Header>
                <SorteringHeader
                    sortering={Sorteringsfelt.MOTESTATUS}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.MOTESTATUS}
                    skalVises={
                        !!ferdigfilterListe?.includes(MOTER_IDAG) && valgteKolonner.includes(Kolonne.MOTE_ER_AVTALT)
                    }
                    className="col col-xs-2"
                    title="Møtestatus"
                    tekst="Avtalt med NAV"
                    headerId="avtalt-mote"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.UTKAST_14A_STATUS}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.UTKAST_14A_STATUS}
                    skalVises={
                        !!ferdigfilterListe?.includes(UNDER_VURDERING) && valgteKolonner.includes(Kolonne.VEDTAKSTATUS)
                    }
                    tekst="Status § 14a-vedtak"
                    className="col col-xs-2"
                    title="Status oppfølgingvedtak"
                    headerId="vedtakstatus"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.UTKAST_14A_STATUS_ENDRET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.UTKAST_14A_STATUS_ENDRET}
                    tekst="Statusendring"
                    skalVises={
                        !!ferdigfilterListe?.includes(UNDER_VURDERING) &&
                        valgteKolonner.includes(Kolonne.VEDTAKSTATUS_ENDRET)
                    }
                    className="col col-xs-2"
                    title="Dager siden fikk status"
                    headerId="vedtakstatus-endret"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.UTKAST_14A_ANSVARLIG_VEILEDER}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.UTKAST_14A_ANSVARLIG_VEILEDER}
                    tekst="Ansvarlig for vedtak"
                    skalVises={
                        !!ferdigfilterListe?.includes(UNDER_VURDERING) &&
                        valgteKolonner.includes(Kolonne.ANSVARLIG_VEILEDER_FOR_VEDTAK)
                    }
                    className="col col-xs-2"
                    title="Ansvarlig veileder for vedtak"
                    headerId="vedtakstatus-endret"
                />
                <Header
                    skalVises={!!filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING)}
                    className="col col-xs-2"
                    title="Siste endring"
                    headerId="siste-endring"
                >
                    Siste endring
                </Header>
                <SorteringHeader
                    sortering={Sorteringsfelt.SISTE_ENDRING_DATO}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.SISTE_ENDRING_DATO}
                    tekst="Dato siste endring"
                    skalVises={!!filtervalg.sisteEndringKategori && valgteKolonner.includes(Kolonne.SISTE_ENDRING_DATO)}
                    className="col col-xs-2"
                    title="Dato siste endring"
                    headerId="dato-siste-endring"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.CV_SVARFRIST}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.CV_SVARFRIST}
                    tekst="CV svarfrist"
                    className="col col-xs-2"
                    skalVises={valgteKolonner.includes(Kolonne.CV_SVARFRIST)}
                    title="Svarfrist for å svare ja til deling av CV"
                    headerId="cv-svarfrist"
                />
                <Header
                    skalVises={valgteKolonner.includes(Kolonne.AVVIK_14A_VEDTAK)}
                    className="col col-xs-2"
                    title="Status § 14 a-vedtak"
                    headerId="enhetsoversikt-status-14a-vedtak-kolonne-header"
                >
                    Status § 14 a-vedtak
                </Header>
                <SorteringHeader
                    skalVises={
                        valgteKolonner.includes(Kolonne.ENSLIGE_FORSORGERE_UTLOP_OVERGANGSSTONAD) &&
                        !!filtervalg.ensligeForsorgere.length
                    }
                    className="col col-xs-2"
                    title="Utløpsdato for overgangsstønad"
                    headerId="utlop_overgangsstonad"
                    sortering={Sorteringsfelt.ENSLIGE_FORSORGERE_UTLOPS_YTELSE}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ENSLIGE_FORSORGERE_UTLOPS_YTELSE}
                    tekst="Utløp overgangsstønad"
                />
                <SorteringHeader
                    skalVises={
                        valgteKolonner.includes(Kolonne.ENSLIGE_FORSORGERE_VEDTAKSPERIODE) &&
                        !!filtervalg.ensligeForsorgere.length
                    }
                    className="col col-xs-2"
                    title="Type vedtaksperiode for overgangsstønad"
                    headerId="type_vedtaksperiode"
                    sortering={Sorteringsfelt.ENSLIGE_FORSORGERE_VEDTAKSPERIODETYPE}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ENSLIGE_FORSORGERE_VEDTAKSPERIODETYPE}
                    tekst="Type vedtaksperiode overgangsstønad"
                />
                <SorteringHeader
                    skalVises={
                        valgteKolonner.includes(Kolonne.ENSLIGE_FORSORGERE_AKIVITETSPLIKT) &&
                        !!filtervalg.ensligeForsorgere.length
                    }
                    className="col col-xs-2"
                    title="Om bruker har aktivitetsplikt på overgangsstønad"
                    headerId="om_aktivitetsplikt"
                    sortering={Sorteringsfelt.ENSLIGE_FORSORGERE_AKTIVITETSPLIKT}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ENSLIGE_FORSORGERE_AKTIVITETSPLIKT}
                    tekst="Om aktivitetsplikt overgangsstønad"
                />
                <SorteringHeader
                    skalVises={
                        valgteKolonner.includes(Kolonne.ENSLIGE_FORSORGERE_OM_BARNET) &&
                        !!filtervalg.ensligeForsorgere.length
                    }
                    className="col col-xs-3"
                    title="Dato når barnet er hhv. 6 mnd/1 år gammelt"
                    headerId="oppfolging"
                    sortering={Sorteringsfelt.ENSLIGE_FORSORGERE_OM_BARNET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.ENSLIGE_FORSORGERE_OM_BARNET}
                    tekst="Om barnet"
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.BARN_UNDER_18_AAR}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.BARN_UNDER_18_AAR}
                    tekst="Barn under 18 år"
                    className="col col-xs-2"
                    headerId="barn_under_18"
                    skalVises={valgteKolonner.includes(Kolonne.HAR_BARN_UNDER_18)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.UTDANNING_OG_SITUASJON_SIST_ENDRET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.UTDANNING_OG_SITUASJON_SIST_ENDRET}
                    tekst="Dato sist endret"
                    className="col col-xs-2"
                    headerId="dato-sist-endret-utdanning-og-situasjon"
                    skalVises={valgteKolonner.includes(Kolonne.UTDANNING_OG_SITUASJON_SIST_ENDRET)}
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.TILTAKSHENDELSE_TEKST}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.TILTAKSHENDELSE_TEKST}
                    tekst="Hendelse på tiltak"
                    title="Lenke til hendelsen"
                    className="col col-xs-2"
                    headerId="tiltakshendelse-lenke"
                    skalVises={
                        !!ferdigfilterListe?.includes(TILTAKSHENDELSER) &&
                        valgteKolonner.includes(Kolonne.TILTAKSHENDELSE_LENKE)
                    }
                />
                <SorteringHeader
                    sortering={Sorteringsfelt.TILTAKSHENDELSE_DATO_OPPRETTET}
                    onClick={sorteringOnClick}
                    rekkefolge={sorteringsrekkefolge}
                    erValgt={sorteringsfelt === Sorteringsfelt.TILTAKSHENDELSE_DATO_OPPRETTET}
                    tekst="Dato for hendelse"
                    title="Dato da hendelsen ble opprettet"
                    className="col col-xs-2"
                    headerId="tiltakshendelse-dato-opprettet"
                    skalVises={
                        !!ferdigfilterListe?.includes(TILTAKSHENDELSER) &&
                        valgteKolonner.includes(Kolonne.TILTAKSHENDELSE_DATO_OPPRETTET)
                    }
                />
            </div>
            <div className="brukerliste__gutter-right" />
        </div>
    );
}

export default EnhetListehode;

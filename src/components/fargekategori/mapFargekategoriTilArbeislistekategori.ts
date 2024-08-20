import {FargekategoriModell} from '../../model-interfaces';

export const mapFargekategoriTilArbeislistekategori = (fargekategori: FargekategoriModell) => {
    switch (fargekategori) {
        case FargekategoriModell.FARGEKATEGORI_A:
            return 'minArbeidslisteBla';
        case FargekategoriModell.FARGEKATEGORI_B:
            return 'minArbeidslisteGronn';
        case FargekategoriModell.FARGEKATEGORI_C:
            return 'minArbeidslisteGul';
        case FargekategoriModell.FARGEKATEGORI_D:
            return 'minArbeidslisteLilla';
        default:
            return null;
    }
};

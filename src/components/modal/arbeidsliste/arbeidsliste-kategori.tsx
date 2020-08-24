import * as React from 'react';
import './arbeidsliste-kategori.less';
import { ReactComponent as ArbeidslisteikonBla } from '../../ikoner/arbeidsliste/arbeidslisteikon_bla.svg';
import { ReactComponent as ArbeidslisteikonLilla } from '../../ikoner/arbeidsliste/arbeidslisteikon_lilla.svg';
import { ReactComponent as ArbeidslisteikonGronn } from '../../ikoner/arbeidsliste/arbeidslisteikon_gronn.svg';
import { ReactComponent as ArbeidslisteikonGul } from '../../ikoner/arbeidsliste/arbeidslisteikon_gul.svg';
import Arbeidslistekategori from './arbeidslistekategori';
import { Field } from 'formik';
import { KategoriModell } from '../../../model-interfaces';

function ArbeidslisteKategori(props: { name: string, index: string }) {
    return (
        <Field name={props.name}>
            {({field, form}) => {
                return (
                    <div className="arbeidslistekategori">
                        <span className="skjemaelement__label">Kategori</span>
                        <Arbeidslistekategori
                            value={KategoriModell.BLA}
                            arbeidslistekategori={<ArbeidslisteikonBla/>}
                            name={props.name}
                            onChange={() => form.setFieldValue(field.name, KategoriModell.BLA)}
                            checked={field.value === KategoriModell.BLA}
                            index={props.index}
                            title="Arbeidslisteikon blå"
                        />
                        <Arbeidslistekategori
                            value={KategoriModell.LILLA}
                            arbeidslistekategori={<ArbeidslisteikonLilla/>}
                            name={props.name}
                            onChange={() => form.setFieldValue(props.name, KategoriModell.LILLA)}
                            checked={field.value === KategoriModell.LILLA}
                            index={props.index}
                            title="Arbeidslisteikon lilla"
                        />
                        <Arbeidslistekategori
                            value={KategoriModell.GRONN}
                            arbeidslistekategori={<ArbeidslisteikonGronn/>}
                            name={props.name}
                            onChange={() => form.setFieldValue(props.name, KategoriModell.GRONN)}
                            checked={field.value === KategoriModell.GRONN}
                            index={props.index}
                            title="Arbeidslisteikon grønn"
                        />
                        <Arbeidslistekategori
                            value={KategoriModell.GUL}
                            arbeidslistekategori={<ArbeidslisteikonGul/>}
                            name={props.name}
                            onChange={() => form.setFieldValue(props.name, KategoriModell.GUL)}
                            checked={field.value === KategoriModell.GUL}
                            index={props.index}
                            title="Arbeidslisteikon gul"
                        />
                    </div>
                );
            }}
        </Field>
    );
}

export default ArbeidslisteKategori;

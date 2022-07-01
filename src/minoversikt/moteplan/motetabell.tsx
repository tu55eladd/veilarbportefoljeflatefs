import {dagFraDato} from '../../utils/dato-utils';
import {Heading, Loader, Table} from '@navikt/ds-react';
import * as React from 'react';
import {MoteData} from './moteplan';
import MoteKollonne from './motekollonne';

interface MoteTabellProps {
    dato: Date;
    moter: MoteData[] | null;
    enhetId: string;
}

function MoteTabell({dato, moter, enhetId}: MoteTabellProps) {
    return (
        <div>
            <Heading className="moteplan_tittel" size="small" level="2">
                {dagFraDato(dato)} {dato.getDate()}. {dato.toLocaleString('default', {month: 'long'})}
            </Heading>
            <Table size="small">
                <Table.Header>
                    <Table.Row className="moteplan_tabell_tittelrad">
                        <Table.HeaderCell>Klokkeslett</Table.HeaderCell>
                        <Table.HeaderCell>Deltaker</Table.HeaderCell>
                        <Table.HeaderCell>Avtalt med NAV</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {moter === null && (
                        <Table.Row>
                            <Table.DataCell>
                                <Loader />
                            </Table.DataCell>
                        </Table.Row>
                    )}
                    {moter != null &&
                        moter.map((mote, key) => <MoteKollonne dato={dato} mote={mote} enhetId={enhetId} key={key} />)}
                </Table.Body>
            </Table>
        </div>
    );
}

export default MoteTabell;

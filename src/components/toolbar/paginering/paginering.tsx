import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Chevron, { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import classNames from 'classnames';
import KnappPanel from './knapp-panel';
import { leggSeAlleIUrl, leggSideIUrl } from '../../../utils/url-utils';
import { pagineringSetup } from '../../../ducks/paginering';
import { selectSeAlle, selectSide, selectSideStorrelse } from './paginering-selector';
import { ToolbarPosisjon } from '../toolbar';

interface StateProps {
    side: number;
    sideStorrelse: number;
    seAlle: boolean;
}

interface DispatchProps {
    endrePaginering: (side: number, seAlle: boolean) => void;
}

interface OwnProps {
    skjul: boolean;
    className: string;
    antallTotalt: number;
    onChange: (fra?: number, til?: number) => void;
    toolbarPosisjon?: ToolbarPosisjon;
}

type PagineringProps = StateProps & OwnProps & DispatchProps;

function Paginering(props: PagineringProps) {
    const {
        skjul,
        className,
        onChange,
        side,
        sideStorrelse,
        antallTotalt,
        seAlle,
        endrePaginering
    } = props;

    if (skjul) {
        return null;
    }

    const antallSider: number = Math.ceil(antallTotalt / sideStorrelse);
    const erPaForsteSide: boolean = side === 1;
    const erPaSisteSide: boolean = side >= antallSider;

    const totalPagenering = (sideNumber: number, seAlleBool: boolean): void => {
        endrePaginering(sideNumber, seAlleBool);
        leggSideIUrl(sideNumber);
        onChange();
    };

    return (
        <div className={classNames('paginering', className)}>
            <KnappPanel
                disabled={!seAlle && antallTotalt <= sideStorrelse}
                pressed={seAlle && antallTotalt <= sideStorrelse}
                onClick={() => {
                    leggSeAlleIUrl(!seAlle);
                    totalPagenering(1, !seAlle);
                }}
            >
                {!seAlle ? <FormattedMessage id="paginering.se.alle"/> :
                    <FormattedMessage id="paginering.se.faerre"/>
                }
            </KnappPanel>

            <KnappPanel disabled={erPaForsteSide} onClick={() => totalPagenering(side - 1, seAlle)}>
                <VenstreChevron>
                    <FormattedMessage id="paginering.forrige"/>
                </VenstreChevron>
            </KnappPanel>

            {!erPaForsteSide && <KnappPanel onClick={() => totalPagenering(1, seAlle)}>1</KnappPanel>}

            <KnappPanel>
                <strong>{side}</strong>
            </KnappPanel>

            {(!erPaSisteSide && !seAlle) &&
            <KnappPanel
                onClick={() => totalPagenering(antallSider, seAlle)}
            >{antallSider}
            </KnappPanel>
            }

            <KnappPanel disabled={erPaSisteSide || seAlle} onClick={() => totalPagenering(side + 1, seAlle)}>
                <HoyreChevron>
                    <FormattedMessage id="paginering.neste"/>
                </HoyreChevron>
            </KnappPanel>
        </div>
    );
}

const mapStateToProps = (state): StateProps => {
    return ({
        side: selectSide(state),
        sideStorrelse: selectSideStorrelse(state),
        seAlle: selectSeAlle(state),
    });
};

const mapDispatchToProps = (dispatch, props: OwnProps) => ({
    endrePaginering: (side, seAlle) => dispatch(pagineringSetup({side, seAlle }, props.toolbarPosisjon))
});

export default connect(mapStateToProps, mapDispatchToProps)(Paginering);
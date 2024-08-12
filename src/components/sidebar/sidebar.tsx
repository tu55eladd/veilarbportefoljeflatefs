import React, {Dispatch, useRef} from 'react';
import {useDispatch} from 'react-redux';
import classNames from 'classnames';
import {Tabs} from '@navikt/ds-react';
import {SidebarTabs, useSidebarViewStore} from '../../store/sidebar/sidebar-view-store';
import {ReactComponent as StatusIkon} from '../ikoner/tab_status.svg';
import {ReactComponent as FilterIkon} from '../ikoner/tab_filter.svg';
import {ReactComponent as VeiledergruppeIkon} from '../ikoner/tab_veiledergrupper.svg';
import {ReactComponent as MineFilterIkon} from '../ikoner/tab_mine-filter.svg';
import {FiltervalgModell} from '../../model-interfaces';
import {OrNothing} from '../../utils/types/types';
import {Tiltak} from '../../ducks/enhettiltak';
import {OversiktType} from '../../ducks/ui/listevisning';
import {logEvent} from '../../utils/frontend-logger';
import {finnSideNavn} from '../../middleware/metrics-middleware';
import outsideClick from '../../hooks/use-outside-click';
import {useWindowWidth} from '../../hooks/use-window-width';
import {SIDEBAR_TAB_ENDRET, skjulSidebar, visSidebar} from '../../ducks/sidebar-tab';
import {Statustall} from '../../filtrering/filtrering-status/filtrering-status';
import {Fanevelger} from './fanevelger';
import {Tab} from './Tab';
import './sidebar.css';

interface EndreSideBarProps {
    dispatch: Dispatch<any>;
    currentOversiktType: OversiktType;
    requestedTab: SidebarTabs;
}

export function endreValgtSidebarTab({dispatch, currentOversiktType, requestedTab}: EndreSideBarProps) {
    dispatch({
        name: currentOversiktType,
        selectedTab: requestedTab,
        type: SIDEBAR_TAB_ENDRET
    });
}

export interface Fanedetaljer {
    icon: React.ReactNode;
    tittel: string;
}

const faner: {[key in SidebarTabs]: Fanedetaljer} = {
    [SidebarTabs.STATUS]: {
        icon: <StatusIkon />,
        tittel: 'Status'
    },
    [SidebarTabs.MINE_FILTER]: {
        icon: <MineFilterIkon />,
        tittel: 'Mine filter'
    },
    [SidebarTabs.VEILEDERGRUPPER]: {
        icon: <VeiledergruppeIkon />,
        tittel: 'Veiledergrupper'
    },
    [SidebarTabs.FILTER]: {
        icon: <FilterIkon />,
        tittel: 'Filter'
    }
};

interface SidebarProps {
    filtervalg: FiltervalgModell;
    enhettiltak: OrNothing<Tiltak>;
    oversiktType: OversiktType;
    statustall: Statustall;
}

function Sidebar({filtervalg, enhettiltak, oversiktType, statustall}: SidebarProps) {
    const dispatch = useDispatch();
    const erPaMinOversikt = oversiktType === OversiktType.minOversikt;
    const windowWidth = useWindowWidth();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const sidebarState = useSidebarViewStore(
        erPaMinOversikt ? OversiktType.minOversikt : OversiktType.enhetensOversikt
    );

    const taBortVeiledergrupperPaMinOversikt = (fane: SidebarTabs) =>
        !(erPaMinOversikt && fane === SidebarTabs.VEILEDERGRUPPER);
    const fanerForSide: SidebarTabs[] = [
        SidebarTabs.STATUS,
        SidebarTabs.MINE_FILTER,
        SidebarTabs.VEILEDERGRUPPER,
        SidebarTabs.FILTER
    ].filter(taBortVeiledergrupperPaMinOversikt);

    const isSidebarHidden = useSidebarViewStore(oversiktType).isSidebarHidden;

    outsideClick(sidebarRef, () => {
        if (windowWidth < 1200 && !isSidebarHidden && document.body.className !== 'navds-modal__document-body') {
            logEvent('portefolje.metrikker.klikk-utenfor', {
                sideNavn: finnSideNavn()
            });
            dispatch(skjulSidebar(oversiktType));
        }
    });

    const onTabsChange = (valgtFane: string) => {
        const fane: SidebarTabs = SidebarTabs[valgtFane];

        endreValgtSidebarTab({
            dispatch: dispatch,
            currentOversiktType: oversiktType,
            requestedTab: fane
        });

        if (isSidebarHidden) {
            dispatch(visSidebar(oversiktType));
        }

        logEvent('portefolje.metrikker.sidebar-tab', {
            tab: valgtFane,
            sideNavn: finnSideNavn(),
            isSidebarHidden: isSidebarHidden
        });
    };

    return (
        <div
            ref={sidebarRef}
            aria-label={`Sidenavigasjon er nå ${isSidebarHidden ? 'lukket' : 'åpen'}`}
            aria-live="polite"
            className={classNames('sidebar', isSidebarHidden && 'sidebar__hidden', 'tabs')}
        >
            {
                <Tabs value={sidebarState.selectedTab} onChange={onTabsChange}>
                    <Tabs.List className="sidebar__tab-container">
                        {fanerForSide.map(fane => (
                            <Tab fane={fane} fanedetaljer={faner[fane]} />
                        ))}
                    </Tabs.List>
                    {!isSidebarHidden && (
                        <div
                            className="sidebar__content-container"
                            data-testid="sidebar_content-container"
                            // id={sidebarState.selectedTab} // TODO: sjekk om id vert brukt nokon stad
                        >
                            {fanerForSide.map(fane => (
                                <Tabs.Panel value={fane}>
                                    <Fanevelger
                                        valgtFane={fane}
                                        fanetittel={faner[fane].tittel}
                                        oversiktType={oversiktType}
                                        filtervalg={filtervalg}
                                        enhettiltak={enhettiltak}
                                        statustall={statustall}
                                    />
                                </Tabs.Panel>
                            ))}
                        </div>
                    )}
                </Tabs>
            }
        </div>
    );
}

export default Sidebar;

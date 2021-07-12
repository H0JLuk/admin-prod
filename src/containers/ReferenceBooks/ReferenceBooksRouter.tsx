import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch, useLocation, matchPath } from 'react-router-dom';
import useBodyClassForSidebar from '@hooks/useBodyClassForSidebar';
import Header from '@components/Header/Header';
import BusinessRolesRouter from './BusinessRolesPage/BusinessRolesRouter';
import {
    BUSINESS_ROLE_PAGES,
    ROUTE_ADMIN,
} from '@constants/route';

import styles from './ReferenceBooksRouter.module.css';

const INITIAL_STATE = {
    buttonBack: false,
    menuMode: true,
};

const HIDE_MENU_AND_SHOW_BACK_BTN = {
    buttonBack: true,
    menuMode: false,
};

const PATHS_FOR_MENU_MODE = [
    // `${ROUTE_ADMIN.REFERENCE_BOOKS}${ LOCATIONS_PAGES.LIST }`,
    // `${ROUTE_ADMIN.REFERENCE_BOOKS}${ SALE_POINT_PAGES.LIST }`,
    `${ROUTE_ADMIN.REFERENCE_BOOKS}${ BUSINESS_ROLE_PAGES.LIST }`,
];

const ReferenceBooksRouter = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const { pathname } = useLocation();
    const match = useRouteMatch();

    useEffect(() => {
        setState(matchPath(pathname, PATHS_FOR_MENU_MODE)?.isExact ? INITIAL_STATE : HIDE_MENU_AND_SHOW_BACK_BTN);
    }, [pathname]);

    useBodyClassForSidebar();

    return (
        <div className={styles.container}>
            <Header {...state} />
            <Switch>
                {/* <Route
                    path={ `${ match.path }${ LOCATIONS_PAGES.LIST }` }
                    component={ LocationsRouter }
                />
                <Route
                    path={ `${ match.path }${ SALE_POINT_PAGES.LIST }` }
                    component={ SalePointsRouter }
                /> */}
                <Route
                    path={`${match.path}${BUSINESS_ROLE_PAGES.LIST}`}
                    component={BusinessRolesRouter}
                />
                {/* Здесь будут роуты для остальных страниц справочников */}

                <Redirect to={`${match.path}${BUSINESS_ROLE_PAGES.LIST}`} />
            </Switch>
        </div>
    );
};

export default ReferenceBooksRouter;

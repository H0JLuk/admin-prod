import * as sessionService from '../../api/services/sessionService';
import { createBrowserHistory } from 'history';
import {
    PROMO_CAMPAIGN_PAGES,
    ROUTE,
    ROUTE_ADMIN,
    ROUTE_OWNER,
    ROUTE_PARTNER,
    ROUTE_USER_MANAGER,
} from '../../constants/route';
import {
    goToLogin,
    goToClientApps,
    goToAudit,
    goToUserManager,
    goToPartner,
    goToDashboard,
    goToStartPage,
    goToProduct,
    goToAdmin,
    goApp,
    getLinkForCreatePromoCampaign,
    getPathForCopyPromoCampaign,
    getPathForPromoCampaignInfo,
    getPathForCreatePromoCampaignVisibititySetting,
    getPathForPromoCampaignVisibititySettings,
    getLinkForPromoCampaignPage,
    getLinkForUsersPage,
} from '../appNavigation';

describe('history api should be call', () => {
    let history;
    let pushSpy;
    let replaceSpy;

    beforeEach(() => {
        history = createBrowserHistory();
        pushSpy = jest.spyOn(history, 'push');
        replaceSpy = jest.spyOn(history, 'replace');
    });

    it('should go to the login page', () => {
        goToLogin(history);
        expect(pushSpy).toHaveBeenCalledWith(ROUTE.LOGIN);
    });

    it('should go to the client-apps page using the push method', () => {
        goToClientApps(history);
        expect(pushSpy).toHaveBeenCalledWith(ROUTE.CLIENT_APPS);
        expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('should go to the client-apps page using the replace method', () => {
        goToClientApps(history, true);
        expect(replaceSpy).toHaveBeenCalledWith(ROUTE.CLIENT_APPS);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('should go to the auditor page using the push method', () => {
        goToAudit(history);
        expect(pushSpy).toHaveBeenCalledWith(ROUTE.AUDITOR);
        expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('should go to the auditor page using the replace method', () => {
        goToAudit(history, true);
        expect(replaceSpy).toHaveBeenCalledWith(ROUTE.AUDITOR);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('should go to the user manager page using the push method', () => {
        goToUserManager(history);
        expect(pushSpy).toHaveBeenCalledWith(ROUTE_USER_MANAGER.USERS);
        expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('should go to the user manager page using the replace method', () => {
        goToUserManager(history, true);
        expect(replaceSpy).toHaveBeenCalledWith(ROUTE_USER_MANAGER.USERS);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('should go to the partner page using the push method', () => {
        goToPartner(history);
        expect(pushSpy).toHaveBeenCalledWith(ROUTE_PARTNER.USERS);
        expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('should go to the partner page using the replace method', () => {
        goToPartner(history, true);
        expect(replaceSpy).toHaveBeenCalledWith(ROUTE_PARTNER.USERS);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('should go to the promo campaign page as an owner', () => {
        goToProduct(history);
        expect(pushSpy).toHaveBeenCalledWith(ROUTE_OWNER.PROMO_CAMPAIGN);
    });

    it('should go to the old design owner page', () => {
        goToProduct(history, true);
        expect(pushSpy).toHaveBeenCalledWith(`${ROUTE.OLD_DESIGN}${ROUTE.OWNER}`);
    });

    it('should go to the promo campaign page as an admin', () => {
        goToAdmin(history);
        expect(pushSpy).toHaveBeenCalledWith(ROUTE_ADMIN.PROMO_CAMPAIGN);
    });

    it('should go to the old design admin page', () => {
        goToAdmin(history, true);
        expect(pushSpy).toHaveBeenCalledWith(`${ROUTE.OLD_DESIGN}${ROUTE.ADMIN}`);
    });

    describe('should shape the path depending on the role', () => {
        describe('should go to the dashboard depending on the role', () => {
            it('should go to the admin dashboard', () => {
                goToDashboard(history, 'Admin');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_ADMIN.DASHBOARD);
            });

            it('should go to the owner dashboard', () => {
                goToDashboard(history, 'Owner');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_OWNER.DASHBOARD);
            });

            it('by default should go to the client-apps', () => {
                goToDashboard(history, 'other');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE.CLIENT_APPS);
            });
        });

        describe('should go to the start page depending on the role', () => {
            it('should go to the admin dashboard using the push method', () => {
                goToStartPage(history, false, 'Admin');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_ADMIN.DASHBOARD);
                expect(replaceSpy).not.toHaveBeenCalled();
            });

            it('should go to the admin dashboard using the replace method', () => {
                goToStartPage(history, true, 'Admin');
                expect(replaceSpy).toHaveBeenCalledWith(ROUTE_ADMIN.DASHBOARD);
                expect(pushSpy).not.toHaveBeenCalled();
            });

            it('should go to the owner dashboard using the push method', () => {
                goToStartPage(history, false, 'Owner');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_OWNER.DASHBOARD);
                expect(replaceSpy).not.toHaveBeenCalled();
            });

            it('should go to the owner dashboard using the replace method', () => {
                goToStartPage(history, true, 'Owner');
                expect(replaceSpy).toHaveBeenCalledWith(ROUTE_OWNER.DASHBOARD);
                expect(pushSpy).not.toHaveBeenCalled();
            });

            it('should go to the auditor page using the push method', () => {
                goToStartPage(history, false, 'Auditor');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE.AUDITOR);
                expect(replaceSpy).not.toHaveBeenCalled();
            });

            it('should go to the auditor page using the replace method', () => {
                goToStartPage(history, true, 'Auditor');
                expect(replaceSpy).toHaveBeenCalledWith(ROUTE.AUDITOR);
                expect(pushSpy).not.toHaveBeenCalled();
            });

            it('should go to the user manager page using the push method', () => {
                goToStartPage(history, false, 'UserManager');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_USER_MANAGER.USERS);
                expect(replaceSpy).not.toHaveBeenCalled();
            });

            it('should go to the user manager page using the replace method', () => {
                goToStartPage(history, true, 'UserManager');
                expect(replaceSpy).toHaveBeenCalledWith(ROUTE_USER_MANAGER.USERS);
                expect(pushSpy).not.toHaveBeenCalled();
            });

            it('should go to the partner page using the push method', () => {
                goToStartPage(history, false, 'Partner');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_PARTNER.USERS);
                expect(replaceSpy).not.toHaveBeenCalled();
            });

            it('should go to the partner page using the replace method', () => {
                goToStartPage(history, true, 'Partner');
                expect(replaceSpy).toHaveBeenCalledWith(ROUTE_PARTNER.USERS);
                expect(pushSpy).not.toHaveBeenCalled();
            });

            it('if role === null should go to the login page', () => {
                goToStartPage(history, false, null);
                expect(pushSpy).toHaveBeenCalledWith(ROUTE.LOGIN);
            });

            it('should go to the login page', () => {
                goToStartPage(history, false, '');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE.LOGIN);
            });

            it('by default should go to the client-apps', () => {
                goToStartPage(history, false, 'other');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE.CLIENT_APPS);
            });
        });

        describe('should go to the app depending on the role', () => {
            it('should go to the auditor page', () => {
                goApp(history, 'Auditor');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE.AUDITOR);
            });

            it('should go to the admin/promo-campaign page', () => {
                goApp(history, 'Admin');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_ADMIN.PROMO_CAMPAIGN);
            });

            it('should go to the old design admin page', () => {
                goApp(history, 'Admin', true);
                expect(pushSpy).toHaveBeenCalledWith(`${ROUTE.OLD_DESIGN}${ROUTE.ADMIN}`);
            });

            it('should go to the user manager page', () => {
                goApp(history, 'UserManager');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_USER_MANAGER.USERS);
            });

            it('should go to the partner page', () => {
                goApp(history, 'Partner');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_PARTNER.USERS);
            });

            it('should go to the promo campaign page as an owner', () => {
                goApp(history, 'Owner');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_OWNER.PROMO_CAMPAIGN);
            });

            it('should go to the old design owner page', () => {
                goApp(history, 'Owner', true);
                expect(pushSpy).toHaveBeenCalledWith(`${ROUTE.OLD_DESIGN}${ROUTE.OWNER}`);
            });

            it('by default should go to the promo campaign page as an owner', () => {
                goApp(history, 'other');
                expect(pushSpy).toHaveBeenCalledWith(ROUTE_OWNER.PROMO_CAMPAIGN);
            });

            it('by default should go to the old design owner page', () => {
                goApp(history, '', true);
                expect(pushSpy).toHaveBeenCalledWith(`${ROUTE.OLD_DESIGN}${ROUTE.OWNER}`);
            });
        });
    });

    describe('should create valid path depending on the role', () => {
        describe('should create link to create promo-campaign', () => {
            it('should create link to create promo campaign as an admin', () => {
                sessionService.getRole = jest.fn(() => 'Admin');
                expect(getLinkForCreatePromoCampaign()).toBe(`${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`);
            });

            it('should create link to create promo campaign as an owner', () => {
                sessionService.getRole = jest.fn(() => 'Owner');
                expect(getLinkForCreatePromoCampaign()).toBe(`${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.ADD_PROMO_CAMPAIGN }`);
            });

            it('by default should return empty string', () => {
                sessionService.getRole = jest.fn(() => 'Partner');
                expect(getLinkForCreatePromoCampaign()).toBe('');
            });
        });

        describe('should create link to copy promo-campaign', () => {
            it('should create link to copy promo campaign as an admin', () => {
                sessionService.getRole = jest.fn(() => 'Admin');
                expect(getPathForCopyPromoCampaign()).toBe(`${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY }`);
            });

            it('should create link to copy promo campaign as an owner', () => {
                sessionService.getRole = jest.fn(() => 'Owner');
                expect(getPathForCopyPromoCampaign()).toBe(`${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_COPY }`);
            });

            it('by default should return empty string', () => {
                sessionService.getRole = jest.fn(() => 'test');
                expect(getPathForCopyPromoCampaign()).toBe('');
            });
        });

        describe('should create link to promo campaign info', () => {
            it('should create link to promo campaign info for admin', () => {
                sessionService.getRole = jest.fn(() => 'Admin');
                expect(getPathForPromoCampaignInfo()).toBe(`${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`);
            });

            it('should create link to promo campaign info for owner', () => {
                sessionService.getRole = jest.fn(() => 'Owner');
                expect(getPathForPromoCampaignInfo()).toBe(`${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.PROMO_CAMPAIGN_INFO }`);
            });

            it('by default should return empty string', () => {
                sessionService.getRole = jest.fn(() => 'test');
                expect(getPathForPromoCampaignInfo()).toBe('');
            });
        });

        describe('should create link to creation promo campaign visibility settings', () => {
            it('should create link to creation promo campaign visibility settings for admin', () => {
                sessionService.getRole = jest.fn(() => 'Admin');
                expect(getPathForCreatePromoCampaignVisibititySetting()).toBe(`${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }/create`);
            });

            it('should create link to creation promo campaign visibility settings for owner', () => {
                sessionService.getRole = jest.fn(() => 'Owner');
                expect(getPathForCreatePromoCampaignVisibititySetting()).toBe(`${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }/create`);
            });

            it('by default should return empty string', () => {
                sessionService.getRole = jest.fn(() => 'test');
                expect(getPathForCreatePromoCampaignVisibititySetting()).toBe('');
            });
        });

        describe('should create link to promo campaign visibility settings', () => {
            it('should create link to promo campaign visibility settings for admin', () => {
                sessionService.getRole = jest.fn(() => 'Admin');
                expect(getPathForPromoCampaignVisibititySettings()).toBe(`${ ROUTE_ADMIN.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }`);
            });

            it('should create link to promo campaign visibility settings for owner', () => {
                sessionService.getRole = jest.fn(() => 'Owner');
                expect(getPathForPromoCampaignVisibititySettings()).toBe(`${ ROUTE_OWNER.PROMO_CAMPAIGN }${ PROMO_CAMPAIGN_PAGES.VISIBILITY_SETTINGS }`);
            });

            it('by default should return empty string', () => {
                sessionService.getRole = jest.fn(() => 'test');
                expect(getPathForPromoCampaignVisibititySettings()).toBe('');
            });
        });

        describe('should create link to promo campaign page', () => {
            it('should create link to promo campaign page for admin', () => {
                sessionService.getRole = jest.fn(() => 'Admin');
                expect(getLinkForPromoCampaignPage()).toBe(ROUTE_ADMIN.PROMO_CAMPAIGN);
            });

            it('should create link to promo campaign page for owner', () => {
                sessionService.getRole = jest.fn(() => 'Owner');
                expect(getLinkForPromoCampaignPage()).toBe(ROUTE_OWNER.PROMO_CAMPAIGN);
            });

            it('by default should return empty string', () => {
                sessionService.getRole = jest.fn(() => 'test');
                expect(getLinkForPromoCampaignPage()).toBe('');
            });
        });

        describe('should create link to users page', () => {
            it('should create link to users page for admin', () => {
                sessionService.getRole = jest.fn(() => 'Admin');
                expect(getLinkForUsersPage()).toBe(ROUTE_ADMIN.USERS);
            });

            it('should create link to users page for owner', () => {
                sessionService.getRole = jest.fn(() => 'Owner');
                expect(getLinkForUsersPage()).toBe(ROUTE_OWNER.DASHBOARD);
            });

            it('should create link to users page for user manager', () => {
                sessionService.getRole = jest.fn(() => 'UserManager');
                expect(getLinkForUsersPage()).toBe(ROUTE_USER_MANAGER.USERS);
            });

            it('should create link to users page for partner', () => {
                sessionService.getRole = jest.fn(() => 'Partner');
                expect(getLinkForUsersPage()).toBe(ROUTE_PARTNER.USERS);
            });

            it('by default should return empty string', () => {
                sessionService.getRole = jest.fn(() => 'test');
                expect(getLinkForUsersPage()).toBe('');
            });
        });
    });
});

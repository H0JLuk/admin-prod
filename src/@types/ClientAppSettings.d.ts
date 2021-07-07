import ROLES from '@constants/roles';
import { DefaultApiResponse } from '@types';

export interface SettingDto {
    clientAppCode?: string;
    key: string;
    value: string;
    userRole?: ROLES;
    promoCampaignId?: number | string;
}

export type ISettingObject = {
    -readonly[setting in keyof typeof ClientSetting]?: string;
};

export interface ISettingList extends DefaultApiResponse {
    settingDtoList: SettingDto[];
}

export enum ClientSetting {
    authorization_method,
    code,
    displayName,
    gradient,
    home_page_description,
    home_page_header,
    home_page_header_present,
    home_page_header_wow,
    inactivity_time,
    installation_url,
    login_types,
    max_password_attempts,
    max_presents_number,
    mechanics,
    name,
    presents_timer,
    privacy_policy,
    promo_show_time,
    tmp_block_time,
    token_lifetime,
    usage_url,
    vitrina_theme,
    where_to_use,
    ym_token,
    design_elements,
}

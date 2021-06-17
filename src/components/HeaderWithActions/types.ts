import { DIRECTION } from '@constants/common';
import { ButtonProps } from './ButtonsBlock';

export type MenuItem = {
    name: string;
    label: string;
    active?: boolean;
};

export type SortingBy = {
    buttonLabel?: string;
    menuItems: MenuItem[];
    onMenuItemClick: (val: string | React.MouseEvent<HTMLDivElement>) => void;
    withReset?: boolean;
    sortBy?: string;
};

export type SearchInput = {
    placeholder?: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    value: string;
};

export type SearchParams = Record<string, string | number> & { direction: DIRECTION; };

export type HeaderWithActionsProps<DataList> = {
    title?: string;
    buttons: ButtonProps[];
    showSearchInput?: boolean;
    showSorting?: boolean;
    triggerResetParams?: any;
    setDataList?: ((data: DataList[]) => void) | React.Dispatch<React.SetStateAction<DataList[]>>;
    copyDataList?: DataList[];
    matchPath?: string;
    sortByFieldKey?: keyof DataList;
    menuItems: MenuItem[];
    inputPlaceholder: string;
    resetLabel?: string;
    params?: SearchParams;
    setParams?: (params: SearchParams) => void;
    onChangeInput?: () => void;
    onChangeSort?: () => void;
    loading?: boolean;
    loadData?: (params: SearchParams) => void | Promise<void>;
    enableAsyncSort?: boolean;
    enableHistoryReplace?: boolean;
};

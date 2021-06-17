import { useEffect } from 'react';

const BODY_CLASS_FOR_SIDEBAR = 'not_highlight_app';

const useBodyClassForSidebar = () => {
    useEffect(() => {
        addBodyClassForSidebar();
        return removeBodyClassForSidebar;
    }, []);
};

export default useBodyClassForSidebar;

export function addBodyClassForSidebar() {
    document.body.classList.add(BODY_CLASS_FOR_SIDEBAR);
}

export function removeBodyClassForSidebar() {
    document.body.classList.remove(BODY_CLASS_FOR_SIDEBAR);
}

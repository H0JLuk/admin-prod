import { useEffect } from 'react';
import { updateTokenLifetime } from '../api/services';

export const useUpdateTokenLifetime = () => {
    useEffect(() => {
        updateTokenLifetime();
    }, []);
};

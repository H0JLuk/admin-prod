import { useEffect } from 'react';
import { updateTokenLifetime } from '@apiServices';

export const useUpdateTokenLifetime = () => {
    useEffect(() => {
        updateTokenLifetime();
    }, []);
};

import { getSession } from './sessionService';
import { Api } from '../apiClient';

export const isLoggedIn = () => !!getSession();
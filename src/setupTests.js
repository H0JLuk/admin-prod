import '@testing-library/jest-dom';
import { configure as enzymeConfigure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import './jestMocks';

enzymeConfigure({ adapter: new Adapter() });

const globalTimeout = global.setTimeout;

export const sleep = async (timeout = 0) => {
    await act(async () => {
        await new Promise((resolve) => globalTimeout(resolve, timeout));
    });
};

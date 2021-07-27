import React from 'react';
import { render } from '@testing-library/react';

import LocationsTypesList from './LocationsTypesList';
import { testLocationsTypesArray } from '../../../../../__tests__/constants';

const props = {
    locationsList: testLocationsTypesArray,
    loading: false,
    onRow: jest.fn(),
    rowSelection: undefined,
};

describe('<LocationsTypesList tests />', () => {
    it('should match snapshot', async () => {
        const { asFragment } = render(<LocationsTypesList {...props} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

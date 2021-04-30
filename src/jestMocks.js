/** global jest */
global.matchMedia = global.matchMedia || function(query) {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {},
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    };
};

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useLayoutEffect: jest.requireActual('react').useEffect,
}));

Promise.allSettled = function (promises) {
    const mappedPromises = promises.map((p) => {
        return p
            .then((value) => {
                return {
                    status: 'fulfilled',
                    value,
                };
            })
            .catch((reason) => {
                return {
                    status: 'rejected',
                    reason,
                };
            });
    });
    return Promise.all(mappedPromises);
};

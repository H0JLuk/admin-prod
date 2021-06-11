import {
    compareArrayOfNumbers,
    getURLSearchParams,
    downloadFile,
    templateLink,
    getBase64,
    getFileURL,
    getFormattedDate,
    getStringSort,
    arrayMove,
    getSearchParamsFromUrl,
    sortItemsBySearchParams,
} from '../helper';

test('getURLSearchParams()', () => {
    expect(getURLSearchParams({ user: 20 })).toEqual('user=20');
    expect(getURLSearchParams({ user: 20, page: 10 })).toEqual('user=20&page=10');
    expect(getURLSearchParams({ user: null })).toEqual('user=null');
    expect(getURLSearchParams({ user: 20, page: 40 })).toEqual('user=20&page=40');
    expect(getURLSearchParams({ user: 20, pageSize: 15 })).toEqual('user=20&pageSize=15');
});

test('downloadFile()', () => {
    const _createObjectURL = URL.createObjectURL;
    URL.createObjectURL = () => '';
    expect(downloadFile(new Blob(), 'file')).toBeUndefined();
    URL.createObjectURL = _createObjectURL;
});

test('templateLink()', () => {
    process.env.PUBLIC_URL = '/test-link';
    expect(templateLink('test')).toBe('/test-link/templates/test');
});

describe('getBase64()', () => {
    it('return base64 string', async () => {
        const base64 = await getBase64(new Blob(['test']));
        expect(base64).toBeTruthy();
    });
});

test('getFileURL()', () => {
    expect(getFileURL('icon')).toBeTruthy();
    expect(getFileURL('background')).toBeTruthy();
    expect(getFileURL('dzo-icon')).toBeTruthy();
});

describe('getFormattedDate()', () => {
    it('should return empty string', () => {
        expect(getFormattedDate()).toBe('');
    });

    it('return any date', () => {
        expect(getFormattedDate('2021-03-27T20:59:59.999')).toBe('27.03.2021');
    });

    it('return 11.10.1996', () => {
        expect(getFormattedDate(new Date(1996, 9, 11))).toEqual('11.10.1996');
    });
});

describe('getStringSort()', () => {
    const ASC = 'ASC';
    const DESC = 'DESC';
    it('direction ASC', () => {
        expect(getStringSort('test', 'test', ASC)).toEqual(0);
        expect(getStringSort('string', 'teststring', ASC)).toEqual(-1);
    });
    it('direction DESC', () => {
        expect(getStringSort('test', 'test', DESC)).toEqual(0);
        expect(getStringSort('string', 'teststring', DESC)).toEqual(1);
    });
});

describe('tests `sortItemsBySearchParams` func', () => {
    const items = [
        { id: 1, name: 'testName1' },
        { id: 221, name: 'testName2' },
        { id: 21, name: 'testName3' },
        { id: 11, name: 'test4' },
    ];

    it('test sort by `id`', () => {
        const params = {
            sortBy: 'id',
            direction: 'ASC',
            filterText: '',
        };
        expect(sortItemsBySearchParams(params, items, 'name')).toEqual([
            { id: 1, name: 'testName1' },
            { id: 11, name: 'test4' },
            { id: 21, name: 'testName3' },
            { id: 221, name: 'testName2' },
        ]);
        expect(sortItemsBySearchParams({ ...params, direction: 'DESC' }, items, 'name')).toEqual([
            { id: 221, name: 'testName2' },
            { id: 21, name: 'testName3' },
            { id: 11, name: 'test4' },
            { id: 1, name: 'testName1' },
        ]);
    });

    it('test sort by `name`', () => {
        const params = {
            sortBy: 'name',
            direction: 'ASC',
            filterText: '',
        };
        expect(sortItemsBySearchParams(params, items, 'name')).toEqual([
            { id: 11, name: 'test4' },
            { id: 1, name: 'testName1' },
            { id: 221, name: 'testName2' },
            { id: 21, name: 'testName3' },
        ]);
        expect(sortItemsBySearchParams({ ...params, direction: 'DESC' }, items, 'name')).toEqual([
            { id: 21, name: 'testName3' },
            { id: 221, name: 'testName2' },
            { id: 1, name: 'testName1' },
            { id: 11, name: 'test4' },
        ]);
    });

    it('test sort by any field', () => {
        const params = {
            sortBy: 'test',
            direction: 'ASC',
            filterText: '',
        };
        expect(sortItemsBySearchParams(params, items, 'test')).toEqual(items);
        expect(sortItemsBySearchParams({ ...params, direction: 'DESC' }, items, 'test')).toEqual(items);
    });

    it('test filter by `name`', () => {
        const params = {
            sortBy: 'name',
            direction: 'ASC',
            filterText: 'name',
        };
        expect(sortItemsBySearchParams(params, items, 'name')).toEqual([
            { id: 1, name: 'testName1' },
            { id: 221, name: 'testName2' },
            { id: 21, name: 'testName3' },
        ]);
        expect(sortItemsBySearchParams({ ...params, direction: 'DESC' }, items, 'name')).toEqual([
            { id: 21, name: 'testName3' },
            { id: 221, name: 'testName2' },
            { id: 1, name: 'testName1' },
        ]);
    });
});

describe('arrayMove()', () => {
    const testArray = ['test', 'meta', '2', '4', 3];
    it('arrayMove from: 1 to 2', () => {
        expect(arrayMove(testArray, 1, 2)).toEqual(['test', '2', 'meta', '4', 3]);
    });

    it('arrayMove from: 2 to 3', () => {
        expect(arrayMove(testArray, 2, 3)).toEqual(['test', 'meta', '4', '2', 3]);
    });
});

describe('getSearchParamsFromUrl()', () => {
    const defaultSearchParams = {
        sortBy: '',
        direction: 'ASC',
        filterText: '',
    };

    it('return search obj', () => {
        expect(getSearchParamsFromUrl('', defaultSearchParams)).toEqual({
            sortBy: '',
            direction: 'ASC',
            filterText: '',
        });
        expect(getSearchParamsFromUrl('', { direction: 'ASC', filterText: 'text', sortBy: 'name' })).toEqual({
            direction: 'ASC',
            filterText: 'text',
            sortBy: 'name',
        });
    });
});

describe('test `compareArrayOfNumbers` function', () => {

    it('should return true', () => {
        expect(compareArrayOfNumbers([], [])).toBe(true);
        expect(compareArrayOfNumbers([1], [1])).toBe(true);
        expect(compareArrayOfNumbers([2, 1], [1, 2])).toBe(true);
    });

    it('should return false', () => {
        expect(compareArrayOfNumbers([1], [])).toBe(false);
        expect(compareArrayOfNumbers([2], [1])).toBe(false);
        expect(compareArrayOfNumbers([2, 1], [1, 3])).toBe(false);
    });

});

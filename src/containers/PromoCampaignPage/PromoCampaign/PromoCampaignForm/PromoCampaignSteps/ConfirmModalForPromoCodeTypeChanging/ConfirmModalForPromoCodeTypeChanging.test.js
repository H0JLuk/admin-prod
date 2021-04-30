import callConfirmModalForPromoCodeTypeChanging from './ConfirmModalForPromoCodeTypeChanging';
import * as utils from '../../../../../../utils/utils';
import { sleep } from '../../../../../../setupTests';

utils.confirmModal = jest.fn();

describe('callConfirmModalForPromoCodeTypeChanging test', () => {
    const handleOk = jest.fn();
    const text = 'OLD_TO_NEW';

    it('confirmModal should be called', () => {
        callConfirmModalForPromoCodeTypeChanging(handleOk, text);
        expect(utils.confirmModal).toHaveBeenCalledTimes(1);
    });

    it('handleOk should be called and resolved', async () => {
        const resSpy = jest.spyOn(Promise, 'resolve');
        callConfirmModalForPromoCodeTypeChanging(handleOk, text);
        await utils.confirmModal.mock.calls[0][0].onOk();
        await sleep();
        expect(handleOk).toHaveBeenCalledTimes(1);
        expect(resSpy).toHaveBeenCalledTimes(1);
    });

    it('onCancel should be called', async () => {
        const resSpy = jest.spyOn(Promise, 'resolve');
        callConfirmModalForPromoCodeTypeChanging(handleOk, text);
        utils.confirmModal.mock.calls[0][0].onCancel();
        await sleep();
        expect(resSpy).toHaveBeenCalledTimes(1);
    });
});

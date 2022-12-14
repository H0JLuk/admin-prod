import { validateURL, urlCheckRule, URL_VALIDATION_TEXT, urlHttpsRule, URL_HTTPS_VALIDATION_TEXT } from '../urlValidator';

test('valid url test', () => {
    expect(validateURL('https://www.sberbank.ru')).toBe(true);
    expect(validateURL('hTTps://www.sberbank.ru')).toBe(true);
    expect(validateURL('WWW.сбербанк.RU')).toBe(true);
    expect(validateURL('сбербанк.RU')).toBe(true);
    expect(validateURL('sberbank.ru')).toBe(true);
    expect(validateURL('test.sberbank.ru?')).toBe(true);
    expect(validateURL('https://www.sberbank.com/?test1=test1&test2=[test2]&test3={test3}')).toBe(true);
    expect(validateURL('https://promo.sberhealth.ru/vvo')).toBe(true);
    expect(validateURL('https://sbol.onelink.me/INEy/89af6cd1')).toBe(true);
    expect(validateURL('https://sbol.onelink.me/INEy/89aTESTcd1#test?eeee=Er')).toBe(true);
    expect(validateURL('https://promo.sberhealth.ru/vVo/teSSS')).toBe(true);
    expect(validateURL('https://promo.sberhealth.ru/?vvo')).toBe(true);
    expect(validateURL('https://promo.sberhealth.ru?vvo')).toBe(true);
    expect(validateURL('https://promo-test878.sberhealth.ru?vvo')).toBe(true);
    expect(validateURL('https://4444.sberhealth.ru?vvo')).toBe(true);
    expect(validateURL('https://4444.sberhealth.co.uk?vvo')).toBe(true);
    expect(validateURL('https://test.co.uk?vvo')).toBe(true);
    expect(validateURL('https://3423.co.uk?vvo')).toBe(true);
    expect(validateURL('3423.co.uk?vvo')).toBe(true);
    expect(validateURL('xn--80abap1arsf.xn--p1ai')).toBe(true);
    expect(validateURL('https://xn--80abap1arsf.xn--p1ai')).toBe(true);
    expect(validateURL('xn--80abap1arsf.ru')).toBe(true);
    expect(validateURL('https://тест.домен.рф?vvo')).toBe(true);
    expect(validateURL('https://тест.домен.рф?ДАнные')).toBe(true);
    expect(validateURL('https://тTст.дJBен.рф?ДАнные')).toBe(true);
    expect(validateURL('https://тест.домен.рф?тест=test')).toBe(true);
    expect(validateURL('https://тест.домен.рф/?тест=test')).toBe(true);
    expect(validateURL('https://sberbank.ru?source=vitrina.sber.ru&offer_client={tест.домен.рф?vvo}')).toBe(true);
    expect(validateURL('https://sberbank.ru?source=vitrina.sber.ru&offer_client={http://tест.домен.рф?vvo}')).toBe(true);
    expect(validateURL('https://sberbank.ru/source=vitrina.sber.ru&offer_client={http://tест.домен.рф?vvo}')).toBe(true);
    expect(validateURL('https://sberbank.ru#source=vitrina.sber.ru&offer_client={http://tест.домен.рф?vvo}')).toBe(true);
    expect(validateURL('https://sberbank.ru/source=vitrina.sber.ru&offer_client={http://tест.домен.рф#vvo}')).toBe(true);
    expect(validateURL('https://okko.tv/?utm_source=sberbank&utm_medium=finance_promo&utm_campaign=vitrina.vsp/{PHONE_NUMBER_HASH}#promo-code/{PROMO_CODE}')).toBe(true);
    expect(validateURL('okko.tv/?utm_source=sberbank&utm_medium=finance_promo&utm_campaign=vitrina.vsp/{PHONE_NUMBER_HASH}#promo-code/{PROMO_CODE}')).toBe(true);
    expect(validateURL('https://www.sberbank.ru/?source=vitrina.sber.ru&offer_client={OFFER_ID}&code_client={PROMO_CODE}&hash={PHONE_NUMBER_HASH}&phone={PHONE_NUMBER}&uid={USER_ID}')).toBe(true);
    expect(validateURL('https://www.sberbank.ru?source=vitrina.sber.ru&offer_client={OFFER_ID}&code_client={PROMO_CODE}&hash={PHONE_NUMBER_HASH}&phone={PHONE_NUMBER}&uid={USER_ID}')).toBe(true);
    expect(validateURL('https://sberbank.ru?source=vitrina.sber.ru&offer_client={OFFER_ID}')).toBe(true);
    expect(validateURL('https://okko.tv?#test')).toBe(true);
    expect(validateURL('android-app://ru.sberbankmobile/android-app/ru.sberbankmobile/sberlogistics?flow=cargoDelivery')).toBe(true);
    expect(validateURL('andrOId-app://ru.sberbankmobile/android-app/ru.sberbankmobile/sberlogistics?flow=cargoDelivery')).toBe(true);
    expect(validateURL('sberbankonline://sberlogistics/?packageSend=https://okko.tv?#test')).toBe(true);
    expect(validateURL('sberbankonline://sberlogistics/?packageSend=ios')).toBe(true);
    expect(validateURL('sberbankONLINE://sberlogistics/?packageSend=ios')).toBe(true);
    expect(validateURL('sberbankONLINE://sberlogistics/?packageSend=IOS')).toBe(true);
    expect(validateURL('https://okko.tv/#promo-code/000659308')).toBe(true);
    expect(validateURL('https://vml8.adj.st/app?adj_t=caih37y&adj_campaign=partner_sberbank&adj_adgroup=partner_sberbank_ecosystem&adj_creative=partner_sberbank_ecosystem_vitrina_2009')).toBe(true);
    expect(validateURL('https://okko.tv/#promo-code/?test=13&tyr=223')).toBe(true);
    expect(validateURL('https://okko.tv/#promo-code?test=13&tyr=223')).toBe(true);
    expect(validateURL('https://oKko.tv/#prOMOo-code?tTsT=13&tYr=2R23')).toBe(true);
    expect(validateURL('https://partner:TloudK4&@dwN@sberdevices.ru/partners_form/vsp/')).toBe(true);
});

test('not valid url test', () => {
    expect(validateURL('http://www.sbarbank.ru')).toBe(false);
    expect(validateURL('http://www.sbarbDnk.Ru')).toBe(false);
    expect(validateURL('HTTP://WWW.SBERBANK.RU')).toBe(false);
    expect(validateURL('http://promo.sberhealth.ru/vvo')).toBe(false);
    expect(validateURL('http://3423.co.uk?vvo')).toBe(false);
    expect(validateURL('http://xn--80abap1arsf.xn--p1ai')).toBe(false);
    expect(validateURL('213123123')).toBe(false);
    expect(validateURL('sberbank')).toBe(false);
    expect(validateURL('.')).toBe(false);
    expect(validateURL('....')).toBe(false);
    expect(validateURL('hello world')).toBe(false);
    expect(validateURL('notsberbank://sberlogistics/?packageSend=ios')).toBe(false);
    expect(validateURL('sberbankonline://sberbank)ru/?offer=1')).toBe(false);
    expect(validateURL('android-app://ru.sberbank))mobile/android-app/ru.sberbankmobile/sberlogistics?flow=cargoDelivery')).toBe(false);
    expect(validateURL('http:sberbank.ru')).toBe(false);
    expect(validateURL('http://sberbank.ru\test=1')).toBe(false);
    expect(validateURL('http:\\sberbank.ru/res')).toBe(false);
    expect(validateURL('htt://sberbank.ru')).toBe(false);
    expect(validateURL('://sberbank.ru')).toBe(false);
    expect(validateURL('sberbank-ru')).toBe(false);
    expect(validateURL('sberba/nk.ru/')).toBe(false);
    expect(validateURL('https://oKko.tv/test={*^}')).toBe(false);
    expect(validateURL('https://t*st.oKko.tv/')).toBe(false);
    expect(validateURL('https:/sberbank+sber.ru')).toBe(false);
    expect(validateURL('https:/sber.ru/test={;}')).toBe(false);
    expect(validateURL('http://44..44.sberhealth.co.uk?vvo')).toBe(false);
    expect(validateURL('http://тест.домен.рф?vvo')).toBe(false);
    expect(validateURL('http://тест.домен.рф?ДАнные')).toBe(false);
    expect(validateURL('http://тTст.дJBен.рф?ДАнные')).toBe(false);
    expect(validateURL('http://тест.домен.рф?тест=test')).toBe(false);
    expect(validateURL('http://тест.домен.рф/?тест=test')).toBe(false);
    expect(validateURL('http://okko.tv/?utm_source=sberbank&utm_medium=finance_promo&utm_campaign=vitrina.vsp/{PHONE_NUMBER_HASH}#promo-code/{PROMO_CODE}')).toBe(false);
});

it('test `urlCheckRule`', async () => {
    const { validator } = urlCheckRule;
    const resolveSpy = jest.spyOn(Promise, 'resolve');
    const rejectSpy = jest.spyOn(Promise, 'reject');

    await validator('', '');
    expect(resolveSpy).toBeCalledTimes(1);
    expect(rejectSpy).toBeCalledTimes(0);

    await expect(validator('', 'testString')).rejects.toThrow(URL_VALIDATION_TEXT);
    expect(resolveSpy).toBeCalledTimes(1);
    expect(rejectSpy).toBeCalledTimes(1);

    await validator('', 'https://testUrl.ru');
    expect(resolveSpy).toBeCalledTimes(2);
    expect(rejectSpy).toBeCalledTimes(1);
});

it('test `urlHttpsRule`', async () => {
    const { validator } = urlHttpsRule;
    const resolveSpy = jest.spyOn(Promise, 'resolve');
    const rejectSpy = jest.spyOn(Promise, 'reject');

    await validator('', '');
    expect(resolveSpy).toBeCalledTimes(1);
    expect(rejectSpy).toBeCalledTimes(0);

    await expect(validator('', 'testString')).rejects.toThrow(URL_HTTPS_VALIDATION_TEXT);
    expect(resolveSpy).toBeCalledTimes(1);
    expect(rejectSpy).toBeCalledTimes(1);

    await expect(validator('', 'http://testUrl.ru')).rejects.toThrow(URL_HTTPS_VALIDATION_TEXT);
    expect(resolveSpy).toBeCalledTimes(1);
    expect(rejectSpy).toBeCalledTimes(2);

    await validator('', 'https://testUrl.ru');
    expect(resolveSpy).toBeCalledTimes(2);
    expect(rejectSpy).toBeCalledTimes(2);
});

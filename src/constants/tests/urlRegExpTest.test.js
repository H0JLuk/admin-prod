import { URL_REGEXP } from '../common';

test('valid url test', () => {
    expect(URL_REGEXP.test('https://www.sberbank.ru')).toBe(true);
    expect(URL_REGEXP.test('http://www.sbarbank.ru')).toBe(true);
    expect(URL_REGEXP.test('sberbank.ru')).toBe(true);
    expect(URL_REGEXP.test('test.sberbank.ru?')).toBe(true);
    expect(URL_REGEXP.test('https://www.sberbank.com/?test1=test1&test2=[test2]&test3={test3}')).toBe(true);
    expect(URL_REGEXP.test('https://promo.sberhealth.ru/vvo')).toBe(true);
    expect(URL_REGEXP.test('http://promo.sberhealth.ru/vvo')).toBe(true);
    expect(URL_REGEXP.test('http://promo.sberhealth.ru/vVo')).toBe(true);
    expect(URL_REGEXP.test('https://sbol.onelink.me/INEy/89af6cd1')).toBe(true);
    expect(URL_REGEXP.test('https://sbol.onelink.me/INEy/89aTESTcd1#test?eeee=Er')).toBe(true);
    expect(URL_REGEXP.test('http://promo.sberhealth.ru/vVo/teSSS')).toBe(true);
    expect(URL_REGEXP.test('http://promo.sberhealth.ru/?vvo')).toBe(true);
    expect(URL_REGEXP.test('http://promo.sberhealth.ru?vvo')).toBe(true);
    expect(URL_REGEXP.test('https://www.sberbank.ru/?source=vitrina.sber.ru&offer_client={OFFER_ID}&code_client={PROMO_CODE}&hash={PHONE_NUMBER_HASH}&phone={PHONE_NUMBER}&uid={USER_ID}')).toBe(true);
    expect(URL_REGEXP.test('https://www.sberbank.ru?source=vitrina.sber.ru&offer_client={OFFER_ID}&code_client={PROMO_CODE}&hash={PHONE_NUMBER_HASH}&phone={PHONE_NUMBER}&uid={USER_ID}')).toBe(true);
    expect(URL_REGEXP.test('https://sberbank.ru?source=vitrina.sber.ru&offer_client={OFFER_ID}')).toBe(true);
    expect(URL_REGEXP.test('https://okko.tv?#test')).toBe(true);
    expect(URL_REGEXP.test('https://okko.tv/#promo-code/000659308')).toBe(true);
    expect(URL_REGEXP.test('https://vml8.adj.st/app?adj_t=caih37y&adj_campaign=partner_sberbank&adj_adgroup=partner_sberbank_ecosystem&adj_creative=partner_sberbank_ecosystem_vitrina_2009')).toBe(true);
    expect(URL_REGEXP.test('https://okko.tv/#promo-code/?test=13&tyr=223')).toBe(true);
    expect(URL_REGEXP.test('https://okko.tv/#promo-code?test=13&tyr=223')).toBe(true);
    expect(URL_REGEXP.test('https://okko.tv/#prOMOo-code?tTsT=13&tYr=2R23')).toBe(true);
});

test('not valid url test', () => {
    expect(URL_REGEXP.test('213123123')).toBe(false);
    expect(URL_REGEXP.test('sberbank')).toBe(false);
    expect(URL_REGEXP.test('sberbank.43')).toBe(false);
    expect(URL_REGEXP.test('http:sberbank.ru')).toBe(false);
    expect(URL_REGEXP.test('htt://sberbank.ru')).toBe(false);
    expect(URL_REGEXP.test('://sberbank.ru')).toBe(false);
    expect(URL_REGEXP.test('sberbank.ru={arg}')).toBe(false);
    expect(URL_REGEXP.test('sberbank.ru/?/')).toBe(false);
    expect(URL_REGEXP.test('sberbank-ru')).toBe(false);
    expect(URL_REGEXP.test('sberbank.ru/?test1=1/test2=2')).toBe(false);
    expect(URL_REGEXP.test('sberbank.ru?/?test1=1')).toBe(false);
});
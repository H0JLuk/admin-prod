export const showCount = { formatter: ({ count, maxLength }) => `Осталось символов ${maxLength - count}` };

/* '^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+{}]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-{}]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator */
export const URL_REGEXP = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-A-Za-z\d%_.~+#]*)*(\?[;&a-z\d%_.~+=-{}]*)?(#[-a-z\d_]*)?$/;

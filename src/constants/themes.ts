/**
 * Здесь должны быть перечислены все возможные темы для фронта приложения.
 * Значение константы должно быть задано в стиле camelCase.
 * Значения должны соответствовать значениям в distributor-web.
 * Для каждой темы должно быть добавлено svg-изображение для Главной страницы, которое должно быть
 * размещено в папке "src/static/images/themes/${theme}/" с именем "main-page-image.svg"
 */
enum Themes {
    DEFAULT = 'default',
    COFFEE = 'coffee',
    GREEN_DAY = 'greenDay',
    NEW_YEAR = 'newYear',
    NEW_YEAR_V2 = 'newYearV2',
    SUMMER = 'summer',
    DEFENDER_FATHERLAND_DAY = 'defenderFatherlandDay',
    WOMENS_DAY = 'womensDay',
    VICTORY_DAY = 'victoryDay',
}

export default Themes;

const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');

module.exports = {
    overrideWebpackConfig: ({ webpackConfig, pluginOptions/* , context: { env, paths } */ }) => {
        const { styles } = require('@ckeditor/ckeditor5-dev-utils');
        const {
            getLoader,
            loaderByName
        } = require('@craco/craco');

        pluginOptions = pluginOptions || {};
        const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);

        const postcssOptions = styles.getPostCssConfig(pluginOptions.postcssLoaderOptions || {});
        const cssExp = /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/;
        const svgExp = /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/;
        const rule = {
            test: cssExp,
            use: [
                {
                    loader: 'style-loader',
                    options: pluginOptions.styleLoaderOptions || {}
                },
                {
                    loader: 'postcss-loader',
                    options: postcssOptions
                }
            ]
        };

        const { match: fileLoaderMatch } = getLoader(
            webpackConfig,
            loaderByName('file-loader')
        );
        fileLoaderMatch.loader.exclude.push(cssExp, svgExp);

        const cssLoaders = oneOfRule.oneOf.filter((item) => item.test && !item.test.push && (item.test.test('test.css') || item.test.test('test.module.css')));
        cssLoaders.forEach(item => {
            let { exclude = [] } = item;
            if (exclude.push) {
                exclude.push(cssExp, svgExp);
            } else {
                exclude = [cssExp, svgExp, item.exclude];
            }
            item.exclude = exclude;
        });
        oneOfRule.oneOf.push(rule);


        webpackConfig.plugins.push(new CKEditorWebpackPlugin({
            language: 'ru',
            buildAllTranslationsToSeparateFiles: true,
        }));

        return webpackConfig;
    }
};

const RawLoader = require('craco-raw-loader');
const CraCKEditorPlugin = require('./craco.ckeditor.plugin');
const isProd = process.env.NODE_ENV === 'production';
process.env.PUBLIC_URL = isProd ? '/admin/' : '/';
process.env.GENERATE_SOURCEMAP = isProd ? 'false' : 'true';


module.exports = {
    plugins: [
        {
            plugin: RawLoader,
            options: {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/
            }
        },
        {
            plugin: CraCKEditorPlugin,
            options: {
                styleLoaderOptions: {
                    injectType: 'singletonStyleTag',
                    attributes: {
                        'data-cke': true,
                    },
                },
                postcssLoaderOptions: {
                    themeImporter: {
                        themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                    },
                    minify: true,
                }
            }
        }
    ],
    webpack: {
        configure: {
            output: {
                publicPath: process.env.PUBLIC_URL,
            },
            optimization: {
                splitChunks: {
                    maxSize: 1024 * 1000,
                },
            },
        }
    },
};

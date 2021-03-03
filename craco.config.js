const isProd = process.env.NODE_ENV === 'production';
process.env.PUBLIC_URL = isProd ? '/admin/' : '/';
process.env.GENERATE_SOURCEMAP = isProd ? 'false' : 'true';

module.exports = {
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
        },
    },
};

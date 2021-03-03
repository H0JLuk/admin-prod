module.exports = {
    webpack: {
        configure: {
            output: {
                publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
            },
        },
    },
};

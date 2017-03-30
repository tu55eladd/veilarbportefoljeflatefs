module.exports = {
    entry: './out/index.js',
    output: {
        filename: '../main/webapp/js/bundle.js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            { test: /\.(?:css|less|scss|sass)$/, loader: 'ignore-loader' }
        ]
    }
};

module.exports = {
    parser: 'postcss-scss',
    plugins: [
        require('autoprefixer'),
        require('precss')({
            extension: 'scss'
        })
    ]
};
module.exports = {
    exclude: 'node_modules/**',
    extensions: ['.ts', '.js'],
    babelHelpers: 'runtime',
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": false,
                "targets":{
                    "node":"14"
                }
            }
        ]
    ],
    "plugins": [
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3
            }
        ]
    ]
}

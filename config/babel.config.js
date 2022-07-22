module.exports = {
    exclude: 'node_modules/**',
    extensions: ['.ts', '.js'],
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
        ["@babel/plugin-proposal-class-properties", { "loose": false }]
    ]
}

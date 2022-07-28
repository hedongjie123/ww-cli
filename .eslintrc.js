/** @format */

module.exports = {
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'], //定义文件继承的子规范
    parser: '@typescript-eslint/parser', //定义ESLint的解析器
    plugins: ['@typescript-eslint'], //定义了该eslint文件所依赖的插件
    env: {
        node: true,
        es6: true,
    },
    rules: {
        '@typescript-eslint/no-var-requires': 0,
    },
}

import json from 'rollup-plugin-json'
import copy from 'rollup-plugin-copy-watch'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import autoExternal from 'rollup-plugin-auto-external'

export default [
    {
        input: './src/index.ts',
        output: [
            {
                file: './lib/index.js',
                format: 'cjs',
                strict: false,
            },
        ],
        plugins: [
            autoExternal(),
            resolve(),
            json(),
            commonjs(),
            typescript(),
            copy({
                targets: [{ src: './lib/**/*', dest: './example/src/sdk' }],
                watch: process.env.NODE_ENV === 'testing' && 'src',
                verbose: true,
                hook: 'writeBundle',
            }),
        ],
        watch: {
            include: 'src/*',
        },
    },
]

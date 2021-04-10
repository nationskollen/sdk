import json from 'rollup-plugin-json'
import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy-watch'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

const reactExamplePath = './examples/react-hooks/src/sdk'
const reactExampleComponentsPath = './examples/react-hooks/src/sdk/react'
const nodeExamplePath = './examples/node/src/sdk'
const nodeExampleComponentsPath = './examples/node/src/sdk/react'

export default [
    {
        external: ['bufferutil', 'utf-8-validate', 'ws'],
        input: './src/index.ts',
        output: [
            {
                file: './lib/index.js',
                format: 'esm',
                strict: false,
            },
        ],
        plugins: [
            clear({
                targets: [reactExamplePath, nodeExamplePath],
                hook: 'buildStart',
            }),
            resolve(),
            json(),
            commonjs(),
            typescript(),
            copy({
                targets: [],
                targets: [
                    { src: './lib/*.(js|ts)', dest: reactExamplePath },
                    { src: './lib/*.(js|ts)', dest: nodeExamplePath },
                ],
                watch: 'src',
                verbose: true,
                hook: 'writeBundle',
            }),
        ],
        watch: {
            include: 'src/*',
        },
    },
    {
        external: ['react', 'bufferutil', 'utf-8-validate', 'ws'],
        input: './src/react/index.ts',
        output: [
            {
                file: './lib/react/index.js',
                format: 'esm',
                strict: false,
            },
        ],
        plugins: [
            clear({
                targets: [reactExampleComponentsPath, nodeExampleComponentsPath],
                hook: 'buildStart',
            }),
            resolve(),
            json(),
            commonjs(),
            typescript(),
            copy({
                targets: [
                    { src: './lib/react/*', dest: reactExampleComponentsPath },
                    { src: './lib/react/*', dest: nodeExampleComponentsPath },
                ],
                watch: 'src/react',
                verbose: true,
                hook: 'writeBundle',
            }),
        ],
        watch: {
            include: 'src/react/**/*',
        },
    },
]

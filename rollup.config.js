import json from 'rollup-plugin-json'
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
        input: './src/index.ts',
        output: [
            {
                file: './lib/index.js',
                format: 'esm',
                strict: false,
            },
        ],
        plugins: [
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
        external: ['react', 'react-async-hook'],
        input: './src/react/index.ts',
        output: [
            {
                file: './lib/react/index.js',
                format: 'esm',
                strict: false,
            },
        ],
        plugins: [
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

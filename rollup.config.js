import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy-watch'
import typescript from 'rollup-plugin-typescript2'

const reactExamplePath = './examples/react-hooks/src/sdk'
const reactExampleComponentsPath = './examples/react-hooks/src/sdk/react'

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
            clear({
                targets: [reactExamplePath],
                hook: 'buildStart',
            }),
            typescript(),
            copy({
                targets: [{ src: './lib/*.(js|ts)', dest: reactExamplePath }],
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
        external: ['react'],
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
                targets: [reactExampleComponentsPath],
                hook: 'buildStart',
            }),
            typescript(),
            copy({
                targets: [{ src: './lib/react/*', dest: reactExampleComponentsPath }],
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

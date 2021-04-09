import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy-watch'
import typescript from 'rollup-plugin-typescript2'

const reactExamplePath = './examples/react-hooks/src/sdk'

export default [
    {
        external: ['react'],
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
                targets: [{ src: './lib/*', dest: reactExamplePath }],
                watch: 'src',
                verbose: true,
                hook: 'writeBundle',
            }),
        ],
        watch: {
            include: 'src/**/*',
        },
    },
]

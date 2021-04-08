import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'

const reactExamplePath = './examples/react-hooks/src/sdk'

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
            typescript(),
            copy({
                targets: [{ src: './lib/*', dest: reactExamplePath }],
            }),
        ],
    },
]

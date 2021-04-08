import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'

export default [
    {
        input: './src/index.ts',
        output: [
            {
                file: './lib/index.esm.js',
                format: 'esm',
            },
        ],
        plugins: [
            typescript(),
            copy({
                targets: [{ src: './lib/*', dest: './examples/react-hooks/src/sdk' }],
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './lib/index.js',
            format: 'cjs',
        },
        plugins: [typescript()],
    },
]

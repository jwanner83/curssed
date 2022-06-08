import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

const config = [
  {
    input: 'src/mod.ts',
    plugins: [
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser()
    ],
    output: {
      file: 'dist/curssed.server.js',
      format: 'cjs',
      compact: true
    },
    external: ['fs', 'util', 'jsdom', '@curssed/core']
  }
]

if (production) {
  config.push({
    input: 'dist/types/mod.d.ts',
    plugins: [
      dts(),
      del({ targets: ['dist/types'], hook: 'buildEnd' })
    ],
    output: [
      {
        file: 'dist/curssed.server.d.ts',
        format: 'esm'
      }
    ]
  })
}

export default config

import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

const config = [
  {
    input: 'src/mod.ts',
    plugins: [typescript({ tsconfig: './tsconfig.json' }), terser()],
    output: {
      file: 'dist/curssed.runtime.js',
      format: 'esm',
      compact: true
    }
  }
]

if (production) {
  config.push({
    input: 'dist/types/mod.d.ts',
    plugins: [
      dts(),
      del({ targets: ['dist/types', 'dist/mod.d.ts'], hook: 'buildEnd' })
    ],
    output: [
      {
        file: 'dist/curssed.runtime.d.ts',
        format: 'esm'
      }
    ]
  })
}

export default config

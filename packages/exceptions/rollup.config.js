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
      file: 'dist/mod.js',
      format: 'cjs',
      compact: true
    }
  }
]

if (production) {
  config.push({
    input: 'dist/mod.d.ts',
    plugins: [
      dts(),
      del({ targets: ['dist/**/'], hook: 'buildEnd' })
    ],
    output: [
      {
        file: 'dist/mod.d.ts',
        format: 'esm'
      }
    ]
  })
}

export default config

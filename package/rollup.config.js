import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'

const production = !process.env.ROLLUP_WATCH

export default [{
  input: 'src/mod.ts',
  plugins: [
    typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false })
  ],
  output: {
    file: 'dist/mod.js'
  }
}, {
  input: 'dist/types/mod.d.ts',
  plugins: [
    dts(),
    production && del({ targets: ['dist/types'], hook: 'buildEnd' })
  ],
  output: [
    {
      file: 'dist/mod.d.ts',
      format: 'esm'
    }
  ]
}]

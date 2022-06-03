import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH

const config = [
  {
    input: 'src/mod.ts',
    plugins: [
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false }),
      copy({
        targets: [
          { src: 'dist/curssed.js', dest: '../docs' }
        ]
      })
    ],
    output: {
      file: 'dist/curssed.js',
      format: 'esm'
    }
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
        file: 'dist/curssed.d.ts',
        format: 'esm'
      }
    ]
  })
}

export default config

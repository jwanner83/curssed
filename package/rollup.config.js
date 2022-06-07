import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

const production = !process.env.ROLLUP_WATCH

const config = [
  {
    input: 'src/runtime.ts',
    plugins: [
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false }),
      copy({
        targets: [{ src: 'dist/curssed.runtime.js', dest: '../docs' }]
      })
    ],
    output: {
      file: 'dist/curssed.runtime.js',
      format: 'esm'
    }
  },
  {
    input: 'src/server.ts',
    plugins: [
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false })
    ],
    output: {
      file: 'dist/curssed.server.js',
      format: 'cjs'
    }
  }
]

if (production) {
  config.push({
    input: 'dist/types/mod.d.ts',
    plugins: [dts(), del({ targets: ['dist/types'], hook: 'buildEnd' })],
    output: [
      {
        file: 'dist/curssed.d.ts',
        format: 'esm'
      }
    ]
  })
}

export default config

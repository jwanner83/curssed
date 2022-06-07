import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

const config = [
  {
    input: 'src/runtime.ts',
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      terser()
    ],
    output: {
      file: 'dist/curssed.runtime.js',
      format: 'esm',
      compact: true
    }
  },
  {
    input: 'src/server.ts',
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
    external: ['fs', 'util', 'jsdom']
  },
  {
    input: 'src/cli.ts',
    plugins: [
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false }),
      terser()
    ],
    output: {
      file: 'bin/curssed.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
      compact: true
    },
    external: [
      'arg',
      'fs-extra',
      'fs/promises',
      'jsdom',
      'chalk',
      'node:readline',
      'fs',
      'util'
    ]
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
        file: 'dist/curssed.d.ts',
        format: 'esm'
      }
    ]
  })
}

export default config

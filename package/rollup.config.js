import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
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
        targets: [{ src: 'dist/curssed.runtime.js', dest: '../docs/runtime' }]
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
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false }),
      copy({
        targets: [{ src: 'dist/curssed.server.js', dest: '../docs/server' }]
      })
    ],
    output: {
      file: 'dist/curssed.server.js',
      format: 'cjs'
    },
    external: ['fs', 'util', 'jsdom']
  },
  {
    input: 'src/cli.ts',
    plugins: [
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false })
    ],
    output: {
      file: 'bin/curssed.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node'
    },
    external: [
      'arg',
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

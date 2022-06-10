import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const config = [
  {
    input: 'src/mod.ts',
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser()
    ],
    output: {
      file: 'bin/curssed.cli.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
      compact: true
    },
    external: [
      'arg',
      'fs-extra',
      'fs/promises',
      '@curssed/compiler',
      'chalk',
      'node:readline',
      'path',
      'mime-types',
      'chokidar',
      'jsdom'
    ]
  }
]

export default config

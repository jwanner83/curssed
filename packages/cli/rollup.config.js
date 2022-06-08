import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const config = [

  {
    input: 'src/mod.ts',
    plugins: [
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
      'node:readline'
    ]
  }
]

export default config

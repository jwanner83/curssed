import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pack from './package.json'

const deps = d => (d ? Object.keys(d) : []);

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
      file: 'bin/curssed.cli.mjs',
      format: 'esm',
      banner: '#!/usr/bin/env node',
      compact: true
    },
    external: [
      ...deps(pack.dependencies),
      ...deps(pack.devDependencies)
    ]
  }
]

export default config

#!/usr/bin/env node
const { existsSync } = require('fs')
const { spawnSync } = require('child_process')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const mediaDir = path.join(rootDir, 'media')
const tailwindPackage = path.join(mediaDir, 'node_modules', 'tailwindcss', 'package.json')

if (!existsSync(tailwindPackage)) {
  const result = spawnSync('npm', ['ci'], {
    cwd: mediaDir,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

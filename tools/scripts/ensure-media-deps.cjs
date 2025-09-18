#!/usr/bin/env node
const { existsSync } = require('fs')
const { spawnSync } = require('child_process')
const path = require('path')

const mediaDir = path.resolve(__dirname, '../../media')
const tailwindPackageJson = path.resolve(mediaDir, 'node_modules/tailwindcss/package.json')

if (existsSync(tailwindPackageJson)) {
  process.exit(0)
}

const result = spawnSync('npm', ['ci'], {
  cwd: mediaDir,
  stdio: 'inherit',
  env: process.env,
})

if (result.error) {
  console.error('[tools] Failed to install media dependencies:', result.error)
  process.exit(result.status ?? 1)
}

if (typeof result.status === 'number' && result.status !== 0) {
  process.exit(result.status)
}

#!/usr/bin/env node

/* eslint-disable no-sync,no-await-in-loop,no-use-before-define,no-console */
const process = require('process')
const {eslint} = require('@kynikos/tasks/subprocess')
const {wrapCommander} = require('@kynikos/tasks/commander')


function lint() {
  // See also the .eslintignore file
  return eslint([__dirname])
}


const commander = wrapCommander({
  init: false,
  maintainDependencies: false,
  lint,
  build: false,
  runTests: false,
  todo: false,
  docs: false,
  setupPkg: false,
  makePkg: false,
  installPkg: false,
  publishToNpm: false,
  publishToAur: false,
  release: false,
})

commander.parse(process.argv)

#!/usr/bin/env node

/* eslint-disable no-sync,no-await-in-loop,no-use-before-define,no-console */
const fs = require('fs')
const process = require('process')
const {eslint} = require('@kynikos/tasks/subprocess')
const {wrapCommander} = require('@kynikos/tasks/commander')
const {reportTodo} = require('report-todo')


function lint() {
  // See also the .eslintignore file
  return eslint([__dirname])
}


async function todo({labelOnly}) {
  fs.writeFileSync(
    './TODO.md', // report-todo-ignore-line
    await reportTodo(
      [
        '.',
        '!./.git',
        '!./build',
        '!./dist',
        '!./node_modules',
        '!./README.md',
        '!./TODO.md', // report-todo-ignore-line
      ],
      {
        labels: labelOnly ? [null] : null,
        labelsIsBlacklist: Boolean(labelOnly),
        reportMode: 'markdown',
      },
    ),
  )
}


const commander = wrapCommander({
  init: false,
  maintainDependencies: false,
  lint,
  build: false,
  runTests: false,
  todo,
  docs: false,
  setupPkg: false,
  makePkg: false,
  installPkg: false,
  publishToNpm: false,
  publishToAur: false,
  release: false,
})

commander.parse(process.argv)

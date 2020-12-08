#!/usr/bin/env node

/* eslint-disable no-sync,no-await-in-loop,no-use-before-define,no-console */
const fs = require('fs')
const process = require('process')
const {npxInteractive, firebaseInteractive, eslint} =
  require('@kynikos/tasks/subprocess')
const {wrapCommander} = require('@kynikos/tasks/commander')
const {reportTodo} = require('report-todo')
const firebaseJson = require('./firebase.json')
const firebaseRc = JSON.parse(fs.readFileSync('./.firebaserc', 'utf8'))


function lint() {
  // See also the .eslintignore file
  return eslint([__dirname])
}


function serve() {
  return firebaseInteractive(['emulators:start'])
}


function runTests({
  testNameRegex,
  verbose,
  printConsole,
  printReceived,
  updateExpected,
}) {
  const env = {
    FIRESTORE_EMULATOR_HOST:
      `localhost:${firebaseJson.emulators.firestore.port}`,
    GCLOUD_PROJECT: firebaseRc.projects.default,
  }
  return npxInteractive([
    'jest',
    '--runInBand',
    '--detectOpenHandles',
    '--bail',
  ], {env: {...env, ...process.env}})
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
  runTests,
  todo,
  docs: false,
  setupPkg: false,
  makePkg: false,
  installPkg: false,
  publishToNpm: false,
  publishToAur: false,
  release: false,
})

commander
  .command('serve')
  .description('serve the Firestore emulator on localhost')
  .action(() => serve())

commander.parse(process.argv)

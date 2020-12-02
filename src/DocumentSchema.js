// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const _Schema = require('./_Schema')


module.exports = class DocumentSchema extends _Schema {
  constructor(fields = [], options = {}) {
    const {snapshotFunctions = {}} = options
    super(...fields)
    this.snapshotFunctions = snapshotFunctions
  }

  __installSnapshotFunctions(documentSnapshot) {
    return Object.entries(this.snapshotFunctions).reduce(
      (acc, [fnName, fn]) => {
        acc[fnName] = (...args) => fn(...args, documentSnapshot)
        return acc
      },
      {},
    )
  }
}

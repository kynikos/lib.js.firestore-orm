// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, CollectionSetup, WriteBatch} = require('./index')


module.exports = class DatabaseConnection {
  constructor({appManager, structure, options = {}, connectionData}) {
    const {hooks = {}} = options
    this.__appManager = appManager
    // CollectionReference needs this.database to be defined
    this.database = this
    this.parent = null
    // CollectionReference needs this.__fsDocument to be defined
    this.__fsDocument = this.__appManager.firestore
    // 'structure' must be recreated for every connection, since it's
    // specifically related to 'this' object, so it cannot be created in
    // makeFactory()
    this.structure = fn.makeStructure(this, structure, CollectionSetup)
    this.connectionData = connectionData
    this.__hooks = {
      beforeCreatingDocument: hooks.beforeCreatingDocument,
      afterCreatingDocument: hooks.afterCreatingDocument,
      beforeDeletingDocument: hooks.beforeDeletingDocument,
      afterDeletingDocument: hooks.afterDeletingDocument,
      beforeSettingDocument: hooks.beforeSettingDocument,
      afterSettingDocument: hooks.afterSettingDocument,
      beforeUpdatingDocument: hooks.beforeUpdatingDocument,
      afterUpdatingDocument: hooks.afterUpdatingDocument,
    }
  }

  batch() {
    return new WriteBatch(this)
  }

  async batchCommit(callBack) {
    const batch = this.batch()
    await callBack(batch)
    return batch.commit()
  }

  // eslint-disable-next-line class-methods-use-this
  collection() {
    throw new Error('Not implemented: use CollectionSetup and the structure ' +
      'objects')
  }
}
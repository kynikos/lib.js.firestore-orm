// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, firebaseAdmin, CollectionSetup, WriteBatch} = require('./index')


module.exports = class Database {
  constructor(structure, options = {}) {
    const {firebase: firebaseOptions, hooks = {}} = options
    this.__app = firebaseAdmin.initializeApp(firebaseOptions)
    this.__firestore = firebaseAdmin.firestore()
    // CollectionReference needs this.database to be defined
    this.database = this
    this.parent = null
    // CollectionReference needs this.__fsDocument to be defined
    this.__fsDocument = this.__firestore
    this.structure = fn.makeStructure(this, structure, CollectionSetup)
    this.__hooks = {
      afterCreatingDocument: hooks.afterCreatingDocument,
      afterDeletingDocument: hooks.afterDeletingDocument,
      afterSettingDocument: hooks.afterSettingDocument,
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

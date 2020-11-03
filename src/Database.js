// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, firebaseAdmin, deferredModules, CollectionSetup, WriteBatch} =
  require('./index')


module.exports = class Database {
  constructor(references, options = {}) {
    this.__app = firebaseAdmin.initializeApp(options.firebase)
    this.__firestore = firebaseAdmin.firestore()
    // CollectionReference needs this.database to be defined
    this.database = this
    this.parent = null
    // CollectionReference needs this.__fsDocument to be defined
    this.__fsDocument = this.__firestore
    this.structure = fn.makeStructure(this, references, CollectionSetup)
  }

  batch() {
    return new WriteBatch(this)
  }

  async batchCommit(callBack) {
    const batch = this.batch()
    await callBack(batch)
    return batch.commit()
  }

  collection(collectionPath) {
    return new deferredModules.CollectionReference({
      path: collectionPath,
      parent: this,
    })
  }
}

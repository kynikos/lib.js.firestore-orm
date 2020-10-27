// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const admin = require('firebase-admin')
const CollectionsContainer = require('./CollectionsContainer')
const WriteBatch = require('./WriteBatch')


module.exports = class Database extends CollectionsContainer {
  constructor({collections}) {
    // Do not require the CollectionReference class directly in this module, or it will
    // cause a circular reference with the other modules
    super(collections)
    this.database = this
    admin.initializeApp()
    this.__firestore = admin.firestore()
    this.__fsDocument = this.__firestore
  }

  batch() {
    return new WriteBatch(this)
  }

  async batchCommit(callBack) {
    const batch = this.batch()
    await callBack(batch)
    return batch.commit()
  }
}

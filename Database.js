// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {firebaseAdmin, CollectionsContainer, WriteBatch} = require('./_internal')


module.exports = class Database extends CollectionsContainer {
  constructor({collections}) {
    super(collections)
    this.database = this
    firebaseAdmin.initializeApp()
    this.__firestore = firebaseAdmin.firestore()
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

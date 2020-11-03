// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {QueryDocumentSnapshot} = require('./index')


module.exports = class QuerySnapshot {
  constructor({collection, chooseSchema, __fsQuerySnapshot}) {
    this.collection = collection
    this.__chooseSchema = chooseSchema
    this.__fsQuerySnapshot = __fsQuerySnapshot
    this.empty = __fsQuerySnapshot.empty
    this.readTime = __fsQuerySnapshot.readTime
    this.size = __fsQuerySnapshot.size
    this.__docs = false
  }

  get docs() {
    if (this.__docs === false) {
      this.__docs = this.__fsQuerySnapshot.docs
        .map((__fsQueryDocumentSnapshot) => {
          return new QueryDocumentSnapshot({
            chooseSchema: this.__chooseSchema,
            parentCollection: this.collection,
            __fsQueryDocumentSnapshot,
          })
        })
    }
    return this.__docs
  }

  forEach(callback, thisArgopt) {
    return this.docs.forEach((queryDocumentSnapshot) => {
      return callback.bind(thisArgopt)(queryDocumentSnapshot)
    })
  }
}

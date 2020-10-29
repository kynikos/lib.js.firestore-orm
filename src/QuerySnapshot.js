// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {QueryDocumentSnapshot} = require('./index')


module.exports = class QuerySnapshot {
  constructor({collection, chooseModel, __fsQuerySnapshot}) {
    this.collection = collection
    this.__chooseModel = chooseModel
    this.__fsQuerySnapshot = __fsQuerySnapshot
    this.empty = __fsQuerySnapshot.empty
    this.readTime = __fsQuerySnapshot.readTime
    this.size = __fsQuerySnapshot.size
    this.docs = __fsQuerySnapshot.docs.map((__fsQueryDocumentSnapshot) => {
      return new QueryDocumentSnapshot({
        chooseModel: this.__chooseModel,
        parentCollection: this.collection,
        __fsQueryDocumentSnapshot,
      })
    })
  }

  forEach(callback, thisArgopt) {
    return this.docs.forEach((queryDocumentSnapshot) => {
      return callback.bind(thisArgopt)(queryDocumentSnapshot)
    })
  }
}

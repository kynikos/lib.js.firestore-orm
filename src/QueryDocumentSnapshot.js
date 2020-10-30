// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {DocumentSnapshot} = require('./index')


module.exports = class QueryDocumentSnapshot extends DocumentSnapshot {
  constructor({chooseSchema, parentCollection, __fsQueryDocumentSnapshot}) {
    super({
      __fsDocumentSnapshot: __fsQueryDocumentSnapshot,
      chooseSchema,
      parent: parentCollection,
    })
    this.__fsQueryDocumentSnapshot = __fsQueryDocumentSnapshot
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {DocumentSnapshot} = require('./_internal')


module.exports = class QueryDocumentSnapshot extends DocumentSnapshot {
  constructor({chooseModel, parentCollection, __fsQueryDocumentSnapshot}) {
    super({
      __fsDocumentSnapshot: __fsQueryDocumentSnapshot,
      chooseModel,
      parent: parentCollection,
    })
    this.__fsQueryDocumentSnapshot = __fsQueryDocumentSnapshot
  }
}

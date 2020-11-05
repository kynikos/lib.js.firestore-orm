// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {DocumentSnapshot} = require('./index')


module.exports = class QueryDocumentSnapshot extends DocumentSnapshot {
  constructor({chooseSetup, parentCollection, __fsQueryDocumentSnapshot}) {
    const setup = typeof chooseSetup === 'function'
      ? chooseSetup(__fsQueryDocumentSnapshot.id)
      : chooseSetup

    const documentReference = setup.__makeFromReference(
      parentCollection,
      __fsQueryDocumentSnapshot.ref,
    )

    super({
      __fsDocumentSnapshot: __fsQueryDocumentSnapshot,
      documentReference,
    })
    this.__fsQueryDocumentSnapshot = __fsQueryDocumentSnapshot
  }
}

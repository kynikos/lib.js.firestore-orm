// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, DocumentSnapshot, deferredModules} = require('./index')


module.exports = class QueryDocumentSnapshot extends DocumentSnapshot {
  constructor({chooseSetup, parentCollection, __fsQueryDocumentSnapshot}) {
    // Explicitly warn when not passing a setup, as it's a common mistake,
    // not straighforward to debug because it differs from the native API
    if (!chooseSetup) {
      throw new Error('A document setup, or a function ' +
        'returning one, is required')
    }

    const setup = typeof chooseSetup === 'function'
      ? chooseSetup(__fsQueryDocumentSnapshot.id)
      : chooseSetup

    let _parentCollection

    if (parentCollection instanceof deferredModules.CollectionGroup) {
      _parentCollection = fn.getAncestors(
        parentCollection.__database,
        parentCollection.pathSetups,
        __fsQueryDocumentSnapshot.ref,
      ).pop()
    } else {
      _parentCollection = parentCollection
    }

    const documentReference = setup.__makeFromReference(
      _parentCollection,
      __fsQueryDocumentSnapshot.ref,
    )

    super({
      __fsDocumentSnapshot: __fsQueryDocumentSnapshot,
      documentReference,
    })
    this.__fsQueryDocumentSnapshot = __fsQueryDocumentSnapshot
  }
}

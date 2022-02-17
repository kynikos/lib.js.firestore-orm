// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn} = require('./index')


module.exports = class _CollectionParent {
  collection(...pathSegments) {
    return fn.getCollectionStructureFromDocument(this, pathSegments)
  }

  doc(...pathSegments) {
    return fn.getDocumentStructureFromDocument(this, pathSegments)
  }

  // The advantage of countCollections() over iterCollections() is that it
  // does not require the chooseSetup argument
  async countCollections() {
    const __fsCollections = await this.__fsDocument.listCollections()
    return __fsCollections.length
  }

  async *iterCollections(chooseSetup) {
    const __fsCollections = await this.__fsDocument.listCollections()

    for (const __fsCollection of __fsCollections) {
      const setup = fn.makeSetup(chooseSetup, __fsCollection.id)
      const collection = setup.__makeFromReference(
        this,
        __fsCollection,
      )
      yield collection.structure
    }
  }

  // eslint-disable-next-line class-methods-use-this
  listCollections() {
    throw new Error('Not implemented: use *iterCollections()')
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {oneLine, deferredModules} = require('./_internal')


module.exports = class CollectionsContainer {
  constructor(mapCollectionModels) {
    this.__mapCollectionModels = mapCollectionModels
  }

  collection(...args) {
    const model = this.__mapCollectionModels(...args)

    if (!model) {
      throw new Error(oneLine`No collection models found for this pattern:
        ${args.join(', ')}`)
    }

    const collectionPath = model.__makeFsRelPath(...args)

    if (!collectionPath) {
      throw new Error(oneLine`No collection ID defined for this pattern:
        ${args.join(', ')}`)
    }

    return new deferredModules.CollectionReference({
      parent: this,
      model,
      __fsCollection: this.__fsDocument.collection(collectionPath),
    })
  }
}

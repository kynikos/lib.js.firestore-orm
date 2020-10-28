// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./_internal')


module.exports = class CollectionsContainer {
  constructor(mapCollectionModels) {
    this.__mapCollectionModels = mapCollectionModels
  }

  collection(args) {
    const model = this.__mapCollectionModels(args)
    const collectionPath = model.__makeFsRelPath(args)

    return new deferredModules.CollectionReference({
      parent: this,
      model,
      __fsCollection: this.__fsDocument.collection(collectionPath),
    })
  }
}

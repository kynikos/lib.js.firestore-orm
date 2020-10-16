// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = class CollectionsContainer {
  constructor(Collection, mapCollectionModels) {
    // Do not require the Collection class directly in this module, or it will
    // cause a circular reference with the other modules
    this.__Collection = Collection
    this.__mapCollectionModels = mapCollectionModels
  }

  collection(args) {
    const model = this.__mapCollectionModels(args)

    return new this.__Collection({
      path: model.__makeFsPath(args),
      parent: this,
      model,
    })
  }
}

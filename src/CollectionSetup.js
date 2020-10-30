// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class CollectionSetup {
  constructor(collectionId, references) {
    this.__id = collectionId
    this.__references = references
  }

  make(parent, ...args) {
    const collection = new deferredModules.CollectionReference({
      id: args.length === 0 ? this.__id : this.__id(args[1]),
      parent,
      references: this.__references,
    })
    return collection.structure
  }
}

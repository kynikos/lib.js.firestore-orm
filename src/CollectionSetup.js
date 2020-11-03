// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class CollectionSetup {
  constructor(path, references) {
    this.__path = path
    this.__references = references
  }

  make(parent, ...args) {
    const collection = new deferredModules.CollectionReference({
      path: args.length === 0 ? this.__path : this.__path(args[1]),
      parent,
      references: this.__references,
    })
    return collection.structure
  }
}

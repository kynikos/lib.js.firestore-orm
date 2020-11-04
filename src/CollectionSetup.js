// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class CollectionSetup {
  constructor({path, structure}) {
    this.__path = path
    this.__structure = structure
  }

  __make({parent, path}) {
    let pPath

    if (this.__path) {
      if (typeof this.__path === 'function') {
        pPath = this.__path(path)
      } else if (path) {
        throw new Error('Ambiguous collection path: path cannot be defined ' +
          'both when instantiating CollectionSetup and when running make()')
      } else {
        pPath = this.__path
      }
    } else {
      pPath = path
    }

    return new deferredModules.CollectionReference({
      path: pPath,
      parent,
      structure: this.__structure,
    })
  }

  make(parent, path) {
    const collection = this.__make({parent, path})
    return collection.structure
  }
}

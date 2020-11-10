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

  __install(parent) {
    // It's especially important to avoid installing a document with an
    // auto-generated ID (an empty 'path'), or the user may think that a new
    // document is generated every time one of its functions is called, but
    // that wouldn't be the case
    if (typeof this.__path !== 'string' && !(this.__path instanceof String)) {
      throw new Error("Installing a CollectionSetup requires 'path' to be " +
        'statically defined as a string')
    }

    return new deferredModules.CollectionReference({
      path: this.__path,
      parent,
      structure: this.__structure,
      __calledBySetup: true,
    })
  }

  __makeFromPath(parent, path) {
    if (path !== this.__path) {
      throw new Error("The provided 'path' does not match the configured " +
        "setup's path")
    }

    return new deferredModules.CollectionReference({
      path,
      parent,
      structure: this.__structure,
      __calledBySetup: true,
    })
  }
}

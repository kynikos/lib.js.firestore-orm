// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class DocumentSetup {
  constructor({path, schema, structure}) {
    this.__path = path
    this.__schema = schema
    this.__structure = structure
  }

  __install(parent) {
    // It's especially important to avoid installing a document with an
    // auto-generated ID (an empty 'path'), or the user may think that a new
    // document is generated every time one of its functions is called, but
    // that wouldn't be the case
    if (typeof this.__path !== 'string' && !(this.__path instanceof String)) {
      throw new Error("Installing a DocumentSetup requires 'path' to be " +
        'statically defined as a string')
    }

    return new deferredModules.DocumentReference({
      path: this.__path,
      parent,
      schema: this.__schema,
      structure: this.__structure,
      __calledBySetup: true,
    })
  }

  __makeFromReference(parent, __fsDocument) {
    return new deferredModules.DocumentReference({
      __fsDocument,
      parent,
      schema: this.__schema,
      structure: this.__structure,
      __calledBySetup: true,
    })
  }

  make(parent, path) {
    if (typeof this.__path !== 'function') {
      throw new Error("DocumentSetup must be instantiated with 'path' as a " +
        'function when using it with make()')
    }

    const document = new deferredModules.DocumentReference({
      path: this.__path(path),
      parent,
      schema: this.__schema,
      structure: this.__structure,
      __calledBySetup: true,
    })

    return document.structure
  }

  makeAutoId(parent) {
    if (this.__path) {
      throw new Error("DocumentSetup must be instantiated without 'path' " +
        'when using it with makeAutoId()')
    }

    const document = new deferredModules.DocumentReference({
      parent,
      schema: this.__schema,
      structure: this.__structure,
      __calledBySetup: true,
    })

    return document.structure
  }
}

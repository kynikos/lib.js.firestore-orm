// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class DocumentSetup {
  constructor({schema, getCollectionSetup, structure, userData}) {
    this.__schema = schema
    this.__getCollectionSetup = getCollectionSetup
    this.__structure = structure
    this.__userData = userData
  }

  __makeFromId(parent, id) {
    // It's especially important to avoid installing in the structure a document
    // with an auto-generated ID (an empty 'id'), or the user may think that a
    // new document is generated every time one of its functions is called, but
    // that wouldn't be the case
    if (!id) {
      throw new Error("Making a DocumentSetup requires 'id' to be defined")
    }

    return new deferredModules.DocumentReference({
      id,
      parent,
      schema: this.__schema,
      getCollectionSetup: this.__getCollectionSetup,
      structure: this.__structure,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }

  __makeAutoId(parent) {
    return new deferredModules.DocumentReference({
      parent,
      schema: this.__schema,
      getCollectionSetup: this.__getCollectionSetup,
      structure: this.__structure,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }

  __makeFromReference(parent, __fsDocument) {
    return new deferredModules.DocumentReference({
      __fsDocument,
      parent,
      schema: this.__schema,
      getCollectionSetup: this.__getCollectionSetup,
      structure: this.__structure,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }

  make(parent, id) {
    const document = this.__makeFromId(parent, id)
    return document.structure
  }

  makeAutoId(parent) {
    const document = this.__makeAutoId(parent)
    return document.structure
  }
}

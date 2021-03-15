// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class CollectionSetup {
  constructor({match, documents, structure, userData}) {
    this.__match = match
    this.__documentSetups = documents
    this.__structure = structure
    this.__userData = userData
  }

  __makeFromId(parent, id) {
    return new deferredModules.CollectionReference({
      id,
      parent,
      documentSetups: this.__documentSetups,
      structure: this.__structure,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }

  __makeFromReference(parent, __fsCollection) {
    return new deferredModules.CollectionReference({
      __fsCollection,
      parent,
      documentSetups: this.__documentSetups,
      structure: this.__structure,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }
}

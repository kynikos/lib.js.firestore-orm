// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class CollectionSetup {
  constructor({getDocumentSetup, structure}) {
    this.__getDocumentSetup = getDocumentSetup
    this.__structure = structure
  }

  __makeFromId(parent, id) {
    return new deferredModules.CollectionReference({
      id,
      parent,
      getDocumentSetup: this.__getDocumentSetup,
      structure: this.__structure,
      __calledBySetup: true,
    })
  }
}

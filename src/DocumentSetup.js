// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class DocumentSetup {
  constructor({
    match,
    schema,
    collections,
    structure,
    snapshotFunctions = {},
    enableCreate = true,
    enableDelete = true,
    enableSet = true,
    enableUpdate = true,
    userData,
  }) {
    this.__match = match
    this.__schema = schema
    this.__collectionSetups = collections
    this.__structure = structure
    this.__snapshotFunctions = snapshotFunctions
    this.__enableCreate = enableCreate
    this.__enableDelete = enableDelete
    this.__enableSet = enableSet
    this.__enableUpdate = enableUpdate
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
      collectionSetups: this.__collectionSetups,
      structure: this.__structure,
      snapshotFunctions: this.__snapshotFunctions,
      enableCreate: this.__enableCreate,
      enableDelete: this.__enableDelete,
      enableSet: this.__enableSet,
      enableUpdate: this.__enableUpdate,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }

  __makeAutoId(parent) {
    return new deferredModules.DocumentReference({
      parent,
      schema: this.__schema,
      collectionSetups: this.__collectionSetups,
      structure: this.__structure,
      snapshotFunctions: this.__snapshotFunctions,
      enableCreate: this.__enableCreate,
      enableDelete: this.__enableDelete,
      enableSet: this.__enableSet,
      enableUpdate: this.__enableUpdate,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }

  __makeFromReference(parent, __fsDocument) {
    return new deferredModules.DocumentReference({
      __fsDocument,
      parent,
      schema: this.__schema,
      collectionSetups: this.__collectionSetups,
      structure: this.__structure,
      snapshotFunctions: this.__snapshotFunctions,
      enableCreate: this.__enableCreate,
      enableDelete: this.__enableDelete,
      enableSet: this.__enableSet,
      enableUpdate: this.__enableUpdate,
      userData: this.__userData,
      __calledBySetup: true,
    })
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, WriteBatch} = require('./index')


module.exports = class DatabaseConnection {
  constructor({
    appManager, collectionSetups, structure, userData, options = {},
  }) {
    const {hooks = {}} = options
    this.__appManager = appManager
    // CollectionReference needs this.database to be defined
    this.database = this
    this.parent = null
    // CollectionReference needs this.__fsDocument to be defined
    this.__fsDocument = this.__appManager.firestore
    this.collectionSetups = collectionSetups
    // 'structure' must be recreated for every connection, since it's
    // specifically related to 'this' object, so it cannot be created in
    // makeFactory()
    this.structure = fn.makeStructure(
      this,
      structure,
      this.collection.bind(this),
    )
    this.userData = userData
    this.__hooks = {
      beforeCreatingDocument: hooks.beforeCreatingDocument,
      afterCreatingDocument: hooks.afterCreatingDocument,
      beforeDeletingDocument: hooks.beforeDeletingDocument,
      afterDeletingDocument: hooks.afterDeletingDocument,
      beforeSettingDocument: hooks.beforeSettingDocument,
      afterSettingDocument: hooks.afterSettingDocument,
      beforeUpdatingDocument: hooks.beforeUpdatingDocument,
      afterUpdatingDocument: hooks.afterUpdatingDocument,
    }
  }

  batch() {
    return new WriteBatch(this)
  }

  async batchCommit(callBack) {
    const batch = this.batch()
    await callBack(batch)
    return batch.commit()
  }

  collection(...pathSegments) {
    return fn.getCollectionStructureFromDocument(this, pathSegments)
  }

  doc(...pathSegments) {
    return fn.getDocumentStructureFromDocument(this, pathSegments)
  }
}

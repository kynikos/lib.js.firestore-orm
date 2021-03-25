// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, WriteBatch, CollectionGroup} = require('./index')


module.exports = class Database {
  constructor({
    firebaseAdminApp, collections, structure, userData, options = {},
  }) {
    const {
      defaultEnableDirectCreate = true,
      defaultEnableDirectDelete = true,
      defaultEnableDirectSet = true,
      defaultEnableDirectUpdate = true,
      defaultEnableBatchCreate = true,
      defaultEnableBatchDelete = true,
      defaultEnableBatchSet = true,
      defaultEnableBatchUpdate = true,
      hooks = {},
    } = options

    this.__app = firebaseAdminApp

    // CollectionReference needs this.__database to be defined
    // this.database must be defined after this.structure
    this.__database = this

    this.__parent = null
    this.parent = null

    // CollectionReference needs this.__fsDocument to be defined
    this.__fsDocument = firebaseAdminApp.firestore()

    this.collectionSetups = collections

    this.__defaultEnableDirectCreate = defaultEnableDirectCreate
    this.__defaultEnableDirectDelete = defaultEnableDirectDelete
    this.__defaultEnableDirectSet = defaultEnableDirectSet
    this.__defaultEnableDirectUpdate = defaultEnableDirectUpdate
    this.__defaultEnableBatchCreate = defaultEnableBatchCreate
    this.__defaultEnableBatchDelete = defaultEnableBatchDelete
    this.__defaultEnableBatchSet = defaultEnableBatchSet
    this.__defaultEnableBatchUpdate = defaultEnableBatchUpdate

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

    // 'structure' must be recreated for every connection, since it's
    // specifically related to 'this' object, so it cannot be created in
    // makeFactory()
    // Make sure to make the structure *after* initializing all the other
    // properties above, otherwise some of them would be unavailable to any
    // static document references being created
    this.structure = fn.makeStructure(
      this,
      structure,
      this.collection.bind(this),
    )

    // this.__database is defined earlier in the constructor
    this.database = this.structure
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

  collectionGroup(collectionId, pathSetups) {
    return new CollectionGroup({id: collectionId, database: this, pathSetups})
  }

  doc(...pathSegments) {
    return fn.getDocumentStructureFromDocument(this, pathSegments)
  }

  // eslint-disable-next-line class-methods-use-this
  async *merge(queries, onField, chooseSetup) {
    const uniques = []

    for (const query of queries) {
      // eslint-disable-next-line no-await-in-loop
      for await (const snapshot of query.iter(chooseSetup)) {
        if (onField == null) {
          yield snapshot
        } else {
          const unique = typeof onField === 'function'
            ? onField(snapshot)
            : snapshot.get(onField)
          if (!uniques.includes(unique)) {
            yield snapshot
            uniques.push(unique)
          }
        }
      }
    }
  }
}

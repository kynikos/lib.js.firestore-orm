// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, WriteBatch, CollectionGroup, _CollectionParent} = require('./index')


module.exports = class Database extends _CollectionParent {
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

    super()

    this.__app = firebaseAdminApp

    // CollectionReference needs this.structure, this.__database and
    // this.database to be already defined
    // this.structure is assigned values later in the constructor
    this.structure = {}
    this.__database = this
    this.database = this.structure

    this.__parent = null
    this.parent = null
    this.id = null
    this.path = null

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

    // Make sure to make the structure *after* initializing all the other
    // properties above, otherwise some of them would be unavailable to any
    // static document references being created
    Object.assign(this.structure, fn.makeStructure(
      this,
      structure,
      this.collection.bind(this),
    ))
  }

  batch() {
    return new WriteBatch(this)
  }

  async batchCommit(callBack) {
    const batch = this.batch()
    await callBack(batch)
    return batch.commit()
  }

  collectionGroup(collectionId, pathSetups) {
    return new CollectionGroup({id: collectionId, database: this, pathSetups})
  }

  // It wouldn't make sense for merge() to accept generic iterators, since it
  // only makes sense when applied to the same collection, because it yields
  // the results immediately on the first query that returns them, without doing
  // any field merging in case of different collections
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

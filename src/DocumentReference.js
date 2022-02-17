// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {DEFAULT, fn, DocumentSnapshot, WriteResults, _CollectionParent} =
  require('./index')


module.exports = class DocumentReference extends _CollectionParent {
  constructor({
    id, __fsDocument, parent, schema, collectionSetups, structure,
    snapshotFunctions, enableDirectCreate, enableDirectDelete, enableDirectSet,
    enableDirectUpdate, enableBatchCreate, enableBatchDelete,
    enableBatchSet, enableBatchUpdate,
    userData, __calledBySetup,
  }) {
    if (__calledBySetup !== true) {
      throw new Error('DocumentReference should only be instantiated ' +
        'internally by a DocumentSetup object')
    }
    if (id && id.includes('/')) {
      throw new Error("'id' cannot be a path of segments separated by '/'")
    }

    super()

    // The children CollectionReference objects need this.structure to be already
    // defined, or their 'parent' property will be undefined
    // this.structure is assigned values later in the constructor
    this.structure = {}
    this.__database = parent.__database
    this.database = parent.database
    this.__parent = parent
    this.parent = parent.structure
    this.schema = schema
    this.__fsDocument = __fsDocument || (id
      ? parent.__fsCollection.doc(id)
      // Even passing id=undefined would cause an error, so use a separate call
      // to doc() to auto-generate an ID
      : parent.__fsCollection.doc())
    this.id = this.__fsDocument.id
    this.path = this.__fsDocument.path
    this.collectionSetups = collectionSetups
    this.__snapshotFunctions = snapshotFunctions
    this.__enableDirectCreate = enableDirectCreate === DEFAULT
      ? this.__database.__defaultEnableDirectCreate
      : enableDirectCreate
    this.__enableDirectDelete = enableDirectDelete === DEFAULT
      ? this.__database.__defaultEnableDirectDelete
      : enableDirectDelete
    this.__enableDirectSet = enableDirectSet === DEFAULT
      ? this.__database.__defaultEnableDirectSet
      : enableDirectSet
    this.__enableDirectUpdate = enableDirectUpdate === DEFAULT
      ? this.__database.__defaultEnableDirectUpdate
      : enableDirectUpdate
    this.__enableBatchCreate = enableBatchCreate === DEFAULT
      ? this.__database.__defaultEnableBatchCreate
      : enableBatchCreate
    this.__enableBatchDelete = enableBatchDelete === DEFAULT
      ? this.__database.__defaultEnableBatchDelete
      : enableBatchDelete
    this.__enableBatchSet = enableBatchSet === DEFAULT
      ? this.__database.__defaultEnableBatchSet
      : enableBatchSet
    this.__enableBatchUpdate = enableBatchUpdate === DEFAULT
      ? this.__database.__defaultEnableBatchUpdate
      : enableBatchUpdate
    this.userData = userData
    // Make sure to make the structure *after* initializing all the other
    // properties above, otherwise some of them would be unavailable to any
    // static collection references being created
    Object.assign(this.structure, fn.makeStructure(
      this,
      structure,
      this.collection.bind(this),
    ))
  }

  __installSnapshotFunctions(documentSnapshot) {
    return Object.entries(this.__snapshotFunctions).reduce(
      (acc, [fnName, fn2]) => {
        acc[fnName] = (...args) => fn2(...args, documentSnapshot)
        return acc
      },
      {},
    )
  }

  create(data) {
    return fn.createDocument({
      docRef: this,
      data,
      createFn: async (serializedData) => {
        const __fsWriteResults = await this.__fsDocument.create(serializedData)
        return new WriteResults({__fsWriteResults, serializedData})
      },
    })
  }

  delete(precondition) {
    return fn.deleteDocument({
      docRef: this,
      precondition,
      deleteFn: async (precondition_) => {
        const __fsWriteResults = await this.__fsDocument.delete(precondition_)
        return new WriteResults({__fsWriteResults, serializedData: null})
      },
    })
  }

  DANGEROUS__forceDeleteRecursive() {
    // This function is DANGEROUS because it operates directly on the native
    // Firestore document references, so for example without checking the
    // enableBatch* options, and also needs to use the batch's native
    // __fsWriteBatch object
    return this.__database.batchCommit((batch) => {
      return fn.DANGEROUS__forceDeleteDocumentRecursive(this, batch)
    })
  }

  async get() {
    const __fsDocumentSnapshot = await this.__fsDocument.get()
    return new DocumentSnapshot({
      __fsDocumentSnapshot,
      documentReference: this,
    })
  }

  set(data, options) {
    return fn.setDocument({
      docRef: this,
      data,
      options,
      setFn: async (serializedData, options_) => {
        const __fsWriteResults =
          await this.__fsDocument.set(serializedData, options_)
        return new WriteResults({__fsWriteResults, serializedData})
      },
    })
  }

  update(dataOrField, ...preconditionOrValues) {
    return fn.updateDocument({
      docRef: this,
      dataOrField,
      preconditionOrValues,
      updateFn: async (serializedDataOrField, ...preconditionOrValues_) => {
        const __fsWriteResults = await this.__fsDocument
          .update(serializedDataOrField, ...preconditionOrValues_)
        return new WriteResults({
          __fsWriteResults,
          serializedData: serializedDataOrField,
        })
      },
    })
  }
}

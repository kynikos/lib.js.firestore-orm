// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn} = require('./index')


module.exports = class WriteBatch {
  constructor(database, __fsWriteBatch, lastSerializedData) {
    this.database = database
    this.__fsWriteBatch = __fsWriteBatch || database.__fsDocument.batch()
    this.lastSerializedData = lastSerializedData
  }

  __cloneAfterQueuing(__fsWriteBatch, serializedData) {
    return new WriteBatch(this.database, __fsWriteBatch, serializedData)
  }

  commit() {
    // TODO: commit() returns a Promise that resolves into an Array of native
    //       WriteResults objects: wrap them into this library's custom
    //       WriteResults class?
    return this.__fsWriteBatch.commit()
    // const __fsWriteResultsArray = await this.__fsWriteBatch.commit()
    // return __fsWriteResultsArray.map((__fsWriteResults) => {
    //   return new WriteResults({__fsWriteResults, serializedData: null})
    // })
  }

  // Note that this function is synchronous in the native API, but it returns
  // a Promise here, since createDocument() is asynchronous
  create(document, data) {
    return fn.createDocument({
      docRef: document,
      data,
      batch: this,
      createFn: (serializedData) => {
        const __fsWriteBatch =
          this.__fsWriteBatch.create(document.__fsDocument, serializedData)
        return this.__cloneAfterQueuing(__fsWriteBatch, serializedData)
      },
    })
  }

  // Note that this function is synchronous in the native API, but it returns
  // a Promise here, since deleteDocument() is asynchronous
  delete(document, precondition) {
    return fn.deleteDocument({
      docRef: document,
      precondition,
      batch: this,
      deleteFn: (precondition_) => {
        const __fsWriteBatch =
          this.__fsWriteBatch.delete(document.__fsDocument, precondition_)
        return this.__cloneAfterQueuing(__fsWriteBatch, null)
      },
    })
  }

  // Note that this function is synchronous in the native API, but it returns
  // a Promise here, since setDocument() is asynchronous
  set(document, data, options) {
    return fn.setDocument({
      docRef: document,
      data,
      options,
      batch: this,
      setFn: (serializedData, options_) => {
        const __fsWriteBatch = this.__fsWriteBatch
          .set(document.__fsDocument, serializedData, options_)
        return this.__cloneAfterQueuing(__fsWriteBatch, serializedData)
      },
    })
  }

  // Note that this function is synchronous in the native API, but it returns
  // a Promise here, since updateDocument() is asynchronous
  update(document, dataOrField, ...preconditionOrValues) {
    return fn.updateDocument({
      docRef: document,
      dataOrField,
      preconditionOrValues,
      batch: this,
      updateFn: (serializedDataOrField, ...preconditionOrValues_) => {
        const __fsWriteBatch = this.__fsWriteBatch.update(
          document.__fsDocument,
          serializedDataOrField,
          ...preconditionOrValues_,
        )
        return this.__cloneAfterQueuing(__fsWriteBatch, serializedDataOrField)
      },
    })
  }
}

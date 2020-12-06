// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn} = require('./index')


module.exports = class WriteBatch {
  constructor(database) {
    this.database = database
    this.__fsWriteBatch = database.__app.firestore().batch()
  }

  commit() {
    // TODO: Wrap the returned native WriteResult object in a custom class?
    return this.__fsWriteBatch.commit()
  }

  create(document, data) {
    return fn.createDocument({
      docRef: document,
      data,
      batch: this,
      createFn: (data_) => {
        return this.__fsWriteBatch.create(document.__fsDocument, data_)
      },
    })
  }

  delete(document, precondition) {
    return fn.deleteDocument({
      docRef: document,
      precondition,
      batch: this,
      deleteFn: (precondition_) => {
        return this.__fsWriteBatch.delete(document.__fsDocument, precondition_)
      },
    })
  }

  set(document, data, options) {
    return fn.setDocument({
      docRef: document,
      data,
      options,
      batch: this,
      setFn: (data_, options_) => {
        return this.__fsWriteBatch.set(document.__fsDocument, data_, options_)
      },
    })
  }

  update(document, dataOrField, ...preconditionOrValues) {
    return fn.updateDocument({
      docRef: document,
      dataOrField,
      preconditionOrValues,
      batch: this,
      updateFn: (dataOrField_, ...preconditionOrValues_) => {
        return this.__fsWriteBatch.update(
          document.__fsDocument,
          dataOrField_,
          ...preconditionOrValues_,
        )
      },
    })
  }
}

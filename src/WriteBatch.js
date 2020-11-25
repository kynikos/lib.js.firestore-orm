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
    fn.createDocument({
      docRef: document,
      data,
      batch: this,
      createFn: (data_) => {
        return this.__fsWriteBatch.create(document.__fsDocument, data_)
      },
    })

    // Yes, also the native create() returns the WriteBatch instance
    return this
  }

  delete(document, precondition) {
    fn.deleteDocument({
      docRef: document,
      precondition,
      batch: this,
      deleteFn: (precondition_) => {
        return this.__fsWriteBatch.delete(document.__fsDocument, precondition_)
      },
    })

    // Yes, also the native delete() returns the WriteBatch instance
    return this
  }

  set(document, data, options) {
    fn.setDocument({
      docRef: document,
      data,
      options,
      batch: this,
      setFn: (data_, options_) => {
        return this.__fsWriteBatch.set(document.__fsDocument, data_, options_)
      },
    })

    // Yes, also the native set() returns the WriteBatch instance
    return this
  }

  update(document, dataOrField, ...preconditionOrValues) {
    fn.updateDocument({
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

    // Yes, also the native update() returns the WriteBatch instance
    return this
  }
}

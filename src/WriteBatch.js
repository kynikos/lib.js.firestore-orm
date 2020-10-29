// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

module.exports = class WriteBatch {
  constructor(database) {
    this.__fsWriteBatch = database.__firestore.batch()
  }

  commit() {
    // TODO: Wrap the returned native WriteResult object in a custom class?
    return this.__fsWriteBatch.commit()
  }

  delete(documentRef, precondition) {
    this.__fsWriteBatch.delete(documentRef.__fsDocument, precondition)
    return this
  }
}

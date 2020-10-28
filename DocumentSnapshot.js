// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./_internal')


module.exports = class DocumentSnapshot {
  constructor({__fsDocumentSnapshot, chooseModel, documentReference, parent}) {
    this.model = typeof chooseModel === 'function'
      ? chooseModel(__fsDocumentSnapshot.ref)
      : chooseModel

    this.__fsDocumentSnapshot = __fsDocumentSnapshot
    this.createTime = __fsDocumentSnapshot.createTime
    this.exists = __fsDocumentSnapshot.exists
    this.id = __fsDocumentSnapshot.id
    this.readTime = __fsDocumentSnapshot.readTime
    this.updateTime = __fsDocumentSnapshot.updateTime

    if (__fsDocumentSnapshot.exists) {
      if (documentReference) {
        this.ref = documentReference
      } else {
        this.ref = new deferredModules.DocumentReference({
          parent,
          model: this.model,
          __fsDocument: __fsDocumentSnapshot.ref,
        })
      }
    } else {
      this.ref = null
    }
  }

  data() {
    return this.model.schema.deserialize(this.__fsDocumentSnapshot.data())
  }

  get(field) {
    return this.model.schema
      .deserialize({[field]: this.__fsDocumentSnapshot.get(field)})
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = class DocumentSnapshot {
  constructor({__fsDocumentSnapshot, documentReference}) {
    this.__fsDocumentSnapshot = __fsDocumentSnapshot
    this.createTime = __fsDocumentSnapshot.createTime
    this.exists = __fsDocumentSnapshot.exists
    this.id = __fsDocumentSnapshot.id
    this.readTime = __fsDocumentSnapshot.readTime
    this.updateTime = __fsDocumentSnapshot.updateTime
    if (__fsDocumentSnapshot.exists) {
      this.ref = documentReference
      this.schema = this.ref.__installSnapshotFunctions(this)
    } else {
      this.ref = null
      this.schema = null
    }
    this.__data = false
  }

  data() {
    if (this.__data === false) {
      this.__data =
        this.ref.schema.deserialize(this.__fsDocumentSnapshot.data())
    }
    return this.__data
  }

  get(field) {
    if (this.__data === false) {
      const data = this.__fsDocumentSnapshot.data()
      return this.ref.schema.deserializeField(
        field,
        data[field],
        data,
      )
    }
    return this.__data[field]
  }
}

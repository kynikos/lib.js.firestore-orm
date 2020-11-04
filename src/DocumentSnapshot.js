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
    this.ref = __fsDocumentSnapshot.exists ? documentReference : null
  }

  data() {
    return this.ref.schema.deserialize(this.__fsDocumentSnapshot.data())
  }

  get(field) {
    return this.ref.schema.deserialize({
      [field]: this.__fsDocumentSnapshot.get(field),
    })[field]
  }
}

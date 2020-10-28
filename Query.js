// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {QuerySnapshot} = require('./_internal')


module.exports = class Query {
  constructor({collection, __fsQuery}) {
    this.collection = collection
    this.__fsQuery = __fsQuery
  }

  async get(chooseModel) {
    const __fsQuerySnapshot = await this.__fsQuery.get()
    return new QuerySnapshot({
      collection: this.collection,
      chooseModel,
      __fsQuerySnapshot,
    })
  }

  async *iter(chooseModel) {
    const {docs} = await this.get(chooseModel)
    yield* docs
  }

  limit(limit) {
    const __fsQuery = this.__fsQuery.limit(limit)
    return new Query({
      collection: this.collection,
      __fsQuery,
    })
  }

  where(fieldPath, opStr, value) {
    const __fsQuery = this.__fsQuery.where(fieldPath, opStr, value)
    return new Query({
      collection: this.collection,
      __fsQuery,
    })
  }
}

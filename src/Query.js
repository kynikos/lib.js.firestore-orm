// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {QuerySnapshot, QueryDocumentSnapshot} = require('./index')

// TODO: Use Query.withConverter() to apply the schemas


module.exports = class Query {
  constructor({__callPostConstructor}) {
    if (__callPostConstructor !== true) {
      throw new Error('Remember to call __Query_postConstructor() after ' +
        'instantiating Query')
    }
  }

  __Query_postConstructor({collection, __fsQueryOrCollection}) {
    this.__fsQueryOrCollection = __fsQueryOrCollection
    // Do not use this.collection, to not confuse it with the collection()
    // method of CollectionReference, which extends this class
    this.collectionRef = collection
  }

  async get(chooseSetup) {
    const __fsQuerySnapshot = await this.__fsQueryOrCollection.get()
    return new QuerySnapshot({
      collection: this.collectionRef,
      chooseSetup,
      __fsQuerySnapshot,
    })
  }

  async *iter(chooseSetup) {
    const stream = this.__fsQueryOrCollection.stream()
    for await (const __fsQueryDocumentSnapshot of stream) {
      yield new QueryDocumentSnapshot({
        chooseSetup,
        parentCollection: this.collectionRef,
        __fsQueryDocumentSnapshot,
      })
    }
  }

  limit(limit) {
    const query = new Query({__callPostConstructor: true})
    const __fsQuery = this.__fsQueryOrCollection.limit(limit)
    query.__Query_postConstructor({
      collection: this.collectionRef,
      __fsQueryOrCollection: __fsQuery,
    })
    return query
  }

  limitToLast(limit) {
    const query = new Query({__callPostConstructor: true})
    const __fsQuery = this.__fsQueryOrCollection.limitToLast(limit)
    query.__Query_postConstructor({
      collection: this.collectionRef,
      __fsQueryOrCollection: __fsQuery,
    })
    return query
  }

  orderBy(fieldPath, directionStr) {
    // TODO: Support FieldPath
    const query = new Query({__callPostConstructor: true})
    const __fsQuery =
      this.__fsQueryOrCollection.orderBy(fieldPath, directionStr)
    query.__Query_postConstructor({
      collection: this.collectionRef,
      __fsQueryOrCollection: __fsQuery,
    })
    return query
  }

  select(...fieldPaths) {
    // TODO: Support FieldPath
    const query = new Query({__callPostConstructor: true})
    const __fsQuery =
      this.__fsQueryOrCollection.select(...fieldPaths)
    query.__Query_postConstructor({
      collection: this.collectionRef,
      __fsQueryOrCollection: __fsQuery,
    })
    return query
  }

  // eslint-disable-next-line class-methods-use-this
  stream() {
    throw new Error('Not implemented: use *iter()')
  }

  where(fieldPath, opStr, value) {
    // TODO: Support FieldPath
    const query = new Query({__callPostConstructor: true})
    const __fsQuery = this.__fsQueryOrCollection.where(fieldPath, opStr, value)
    query.__Query_postConstructor({
      collection: this.collectionRef,
      __fsQueryOrCollection: __fsQuery,
    })
    return query
  }
}

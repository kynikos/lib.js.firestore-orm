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

  // eslint-disable-next-line class-methods-use-this,max-params
  async *filter(chooseSetup, onField, whereParameters = []) {
    // Explicitly warn when not passing a setup, as it's a common mistake,
    // not straighforward to debug because it differs from the native API
    if (!chooseSetup) {
      throw new Error('A document setup, or a function ' +
        'returning one, is required')
    }

    if (onField == null) {
      throw new Error("The 'onField' parameter is required")
    }

    let current = new Map()

    // eslint-disable-next-line no-await-in-loop
    for await (const snapshot of this.iter(chooseSetup)) {
      const intersectionKey = snapshot.get(onField)
      current.set(intersectionKey, snapshot)
    }

    for (const [fieldPath, opStr, value] of whereParameters) {
      if (!current.size) {
        break
      }

      const previous = current
      current = new Map()

      // eslint-disable-next-line no-await-in-loop
      for await (const snapshot of this
        .where(fieldPath, opStr, value)
        .select(onField)
        .iter(chooseSetup)
      ) {
        const intersectionKey = snapshot.get(onField)
        if (previous.has(intersectionKey)) {
          current.set(intersectionKey, previous.get(intersectionKey))
        }
      }
    }

    yield* current.values()
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
    // TODO: Support FieldPath objects, but note that for the
    //       moment I'm restricting all field names to be of the "simple"
    //       format in _Field.js ([a-zA-Z_][0-9a-zA-Z_]*), so using
    //       FieldPath shouldn't be necessary; there are other places
    //       where FieldPath should be supported, but it would be harder;
    //       for example in DocumentReference's set() and update()
    //       https://firebase.google.com/docs/firestore/quotas#limits
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
    // TODO: Support FieldPath objects, but note that for the
    //       moment I'm restricting all field names to be of the "simple"
    //       format in _Field.js ([a-zA-Z_][0-9a-zA-Z_]*), so using
    //       FieldPath shouldn't be necessary; there are other places
    //       where FieldPath should be supported, but it would be harder;
    //       for example in DocumentReference's set() and update()
    //       https://firebase.google.com/docs/firestore/quotas#limits
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
    // TODO: Support FieldPath objects, but note that for the
    //       moment I'm restricting all field names to be of the "simple"
    //       format in _Field.js ([a-zA-Z_][0-9a-zA-Z_]*), so using
    //       FieldPath shouldn't be necessary; there are other places
    //       where FieldPath should be supported, but it would be harder;
    //       for example in DocumentReference's set() and update()
    //       https://firebase.google.com/docs/firestore/quotas#limits
    const query = new Query({__callPostConstructor: true})
    const __fsQuery = this.__fsQueryOrCollection.where(fieldPath, opStr, value)
    query.__Query_postConstructor({
      collection: this.collectionRef,
      __fsQueryOrCollection: __fsQuery,
    })
    return query
  }
}

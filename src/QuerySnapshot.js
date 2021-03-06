// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {QueryDocumentSnapshot} = require('./index')


module.exports = class QuerySnapshot {
  constructor({collection, chooseSetup, __fsQuerySnapshot}) {
    // Explicitly warn when not passing a setup, as it's a common mistake,
    // not straighforward to debug because it differs from the native API
    if (!chooseSetup) {
      throw new Error('A document setup, or a function ' +
        'returning one, is required')
    }
    // Do not use this.collection, to not confuse it with the collection()
    // methods of other classes
    this.collectionRef = collection
    this.__chooseSetup = chooseSetup
    this.__fsQuerySnapshot = __fsQuerySnapshot
    this.empty = __fsQuerySnapshot.empty
    this.readTime = __fsQuerySnapshot.readTime
    this.size = __fsQuerySnapshot.size
    this.__docs = false
  }

  get docs() {
    if (this.__docs === false) {
      // this.iter() creates this.__docs as a side effect
      Array.from(this.iter())
    }
    return this.__docs
  }

  forEach(callback, thisArg) {
    return this.docs.forEach(callback, thisArg)
  }

  *iter() {
    if (this.__docs === false) {
      const docs = []

      for (const __fsQueryDocumentSnapshot of this.__fsQuerySnapshot.docs) {
        const queryDocumentSnapshot = new QueryDocumentSnapshot({
          chooseSetup: this.__chooseSetup,
          parentCollection: this.collectionRef,
          __fsQueryDocumentSnapshot,
        })

        yield queryDocumentSnapshot

        docs.push(queryDocumentSnapshot)
      }

      // Save 'docs' to this.__docs only after the loop, to protect it from
      // exceptions raised in callback
      this.__docs = docs
    } else {
      for (const queryDocumentSnapshot of this.__docs) {
        yield queryDocumentSnapshot
      }
    }
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, DocumentSetup, Query} = require('./index')


module.exports = class CollectionReference extends Query {
  constructor({path, parent, structure}) {
    super({__callPostConstructor: true})
    this.database = parent.database
    this.parent = parent
    this.__fsCollection = parent.__fsDocument.collection(path)
    this.id = this.__fsCollection.id
    this.path = this.__fsCollection.path
    this.structure = fn.makeStructure(this, structure, DocumentSetup)
    this.__Query_postConstructor({
      collection: this,
      __fsQueryOrCollection: this.__fsCollection,
    })
  }

  add(setup, data) {
    const doc = this.docAutoId(setup)
    return doc.set(data, {merge: false})
  }

  async deleteAll(chooseSetup) {
    const docs = await this.get(chooseSetup)

    return this.database.batchCommit((batch) => {
      docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
    })
  }

  doc(docPath, setup) {
    if (!docPath) {
      // The native collection objects support calling doc() without arguments
      // to auto-generate a document ID, but I need a setup with this ORM
      throw new Error('To auto-generate a document ID, call docAutoId(setup)')
    }

    return setup.__make({parent: this, path: docPath})
  }

  docAutoId(setup) {
    return setup.__make({parent: this})
  }
}

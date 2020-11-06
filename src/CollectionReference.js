// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, DocumentSetup, Query} = require('./index')


module.exports = class CollectionReference extends Query {
  constructor({path, parent, structure, __calledBySetup}) {
    if (__calledBySetup !== true) {
      throw new Error('CollectionReference should only be instantiated ' +
        'internally by a CollectionSetup object')
    }

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

  // eslint-disable-next-line class-methods-use-this
  add(setup, data) {
    throw new Error('Not implemented: to add a document with an ' +
      'auto-generated ID, use a DocumentSetup object with makeAutoId() ' +
      'method, then either create() or set() the document reference')
  }

  async deleteAllDocuments(chooseSetup) {
    const docs = await this.get(chooseSetup)

    return this.database.batchCommit((batch) => {
      docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  doc() {
    throw new Error('Not implemented: to get a reference to a document, use ' +
      'a DocumentSetup object, possibly with its make() or makeAutoId() method')
  }
}

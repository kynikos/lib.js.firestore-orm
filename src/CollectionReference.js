// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, DocumentSetup, Query} = require('./index')


module.exports = class CollectionReference extends Query {
  constructor({id, parent, getDocumentSetup, structure, __calledBySetup}) {
    if (__calledBySetup !== true) {
      throw new Error('CollectionReference should only be instantiated ' +
        'internally by a CollectionSetup object')
    }
    if (id.includes('/')) {
      throw new Error("'id' cannot be a path of segments separated by '/'")
    }

    super({__callPostConstructor: true})
    this.database = parent.database
    this.parent = parent
    this.__fsCollection = parent.__fsDocument.collection(id)
    this.id = this.__fsCollection.id
    this.path = this.__fsCollection.path
    this.getDocumentSetup = getDocumentSetup
    this.structure = fn.makeStructure(this, structure, DocumentSetup)
    this.__Query_postConstructor({
      collection: this,
      __fsQueryOrCollection: this.__fsCollection,
    })
  }

  // eslint-disable-next-line class-methods-use-this
  add() {
    throw new Error('Not implemented: to add a document with an ' +
      'auto-generated ID, use a DocumentSetup object with makeAutoId() ' +
      'method, then either create() or set() the document reference')
  }

  async deleteAllDocuments(chooseSetup) {
    const res = await this.get(chooseSetup)

    return this.database.batchCommit((batch) => {
      return Promise.all(res.docs.map((doc) => {
        return batch.delete(doc.ref)
      }))
    })
  }

  collection(...pathSegments) {
    return fn.getCollectionStructureFromCollection(this, pathSegments)
  }

  doc(...pathSegments) {
    return fn.getDocumentStructureFromCollection(this, pathSegments)
  }

  docAutoId() {
    return this.getDocumentSetup().makeAutoId(this)
  }
}

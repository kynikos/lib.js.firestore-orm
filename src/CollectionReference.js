// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, Query} = require('./index')


module.exports = class CollectionReference extends Query {
  constructor({
    id, __fsCollection, parent, documentSetups, structure, userData,
    __calledBySetup,
  }) {
    if (__calledBySetup !== true) {
      throw new Error('CollectionReference should only be instantiated ' +
        'internally by a CollectionSetup object')
    }
    if (id && id.includes('/')) {
      throw new Error("'id' cannot be a path of segments separated by '/'")
    }

    super({__callPostConstructor: true})
    // The children DocumentReference objects need this.structure to be already
    // defined, or their 'parent' property will be undefined
    // this.structure is assigned values later in the constructor
    this.structure = {}
    this.__database = parent.__database
    this.database = parent.database
    this.__parent = parent
    this.parent = parent.structure
    this.__fsCollection = __fsCollection || parent.__fsDocument.collection(id)
    this.id = this.__fsCollection.id
    this.path = this.__fsCollection.path
    this.documentSetups = documentSetups
    this.userData = userData
    this.__Query_postConstructor({
      collection: this,
      __fsQueryOrCollection: this.__fsCollection,
    })
    // Make sure to make the structure *after* initializing all the other
    // properties above, otherwise some of them would be unavailable to any
    // static document references being created
    Object.assign(this.structure, fn.makeStructure(
      this,
      structure,
      this.doc.bind(this),
    ))
  }

  // eslint-disable-next-line class-methods-use-this
  add() {
    throw new Error('Not implemented: to add a document with an ' +
      "auto-generated ID, use a CollectionReference object's its docAutoId() " +
      'method, then either create() or set() the document reference')
  }

  DANGEROUS__forceDeleteRecursive() {
    // This function is DANGEROUS because it operates directly on the native
    // Firestore document references, so for example without checking the
    // enableBatch* options, and also needs to use the batch's native
    // __fsWriteBatch object
    return this.__database.batchCommit((batch) => {
      return fn.DANGEROUS__forceDeleteCollectionRecursive(this, batch)
    })
  }

  collection(...pathSegments) {
    return fn.getCollectionStructureFromCollection(this, pathSegments)
  }

  doc(...pathSegments) {
    return fn.getDocumentStructureFromCollection(this, pathSegments)
  }

  docAutoId(docSetup) {
    // Explicitly warn when not passing a setup, as it's a common mistake,
    // not straighforward to debug because it differs from the native API
    if (!docSetup) throw new Error('A document setup is required')
    const document = docSetup.__makeAutoId(this)
    return document.structure
  }

  async *iterDocuments(chooseSetup) {
    const __fsDocuments = await this.__fsCollection.listDocuments()

    for (const __fsDocument of __fsDocuments) {
      const setup = fn.makeSetup(chooseSetup, __fsDocument.id)
      const document = setup.__makeFromReference(
        this.collectionRef,
        __fsDocument,
      )
      yield document.structure
    }
  }

  // eslint-disable-next-line class-methods-use-this
  listDocuments() {
    throw new Error('Not implemented: use *iterDocuments()')
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const DocumentReference = require('./DocumentReference')
const Query = require('./Query')
const QuerySnapshot = require('./QuerySnapshot')


module.exports = class CollectionReference {
  constructor({parent, model, __fsCollection}) {
    this.database = parent.database
    this.parent = parent
    this.model = model
    this.__fsCollection = __fsCollection

    for (
      const [methodName, method]
      of Object.entries(model.__additionalMethods || [])
    ) {
      if (this[methodName]) {
        throw new Error(`The collection already has a ${methodName} property`)
      }
      this[methodName] = method.bind(this)
    }
  }

  doc(args) {
    if (!args) {
      // The native collection objects support calling doc() without arguments
      // to auto-generate a document ID, but I need a model with this ORM
      throw new Error('To auto-generate a document ID, call docAutoId(model)')
    }

    const model = this.model.__mapDocumentModels(args)
    const docPath = model.__makeFsRelPath(args)

    return new DocumentReference({
      parent: this,
      model,
      __fsDocument: this.__fsCollection.doc(docPath),
    })
  }

  docAutoId(model) {
    return new DocumentReference({
      parent: this,
      model,
      __fsDocument: this.__fsCollection.doc(),
    })
  }

  add(model, data) {
    const doc = this.docAutoId(model)
    return doc.set(data)
  }

  async deleteAll(chooseModel) {
    const docs = await this.get(chooseModel)

    return this.database.batchCommit((batch) => {
      docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
    })
  }

  async get(chooseModel) {
    const __fsQuerySnapshot = await this.__fsCollection.get()
    return new QuerySnapshot({
      collection: this,
      chooseModel,
      __fsQuerySnapshot,
    })
  }

  async *iter(chooseModel) {
    const {docs} = await this.get(chooseModel)
    yield* docs
  }

  async where(fieldPath, opStr, value) {
    const __fsQuery = await this.__fsCollection.where(fieldPath, opStr, value)
    return new Query({
      collection: this,
      __fsQuery,
    })
  }
}

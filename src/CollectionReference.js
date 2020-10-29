// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {oneLine, deferredModules, Query, QuerySnapshot} = require('./index')


module.exports = class CollectionReference {
  constructor({parent, model, __fsCollection}) {
    this.database = parent.database
    this.parent = parent
    this.model = model
    this.__fsCollection = __fsCollection

    this.x = Object.entries(model.__additionalMethods || {}).reduce(
      (acc, [methodName, method]) => {
        acc[methodName] = method.bind(this)
        return acc
      },
      {},
    )
  }

  doc(...args) {
    if (!args.length) {
      // The native collection objects support calling doc() without arguments
      // to auto-generate a document ID, but I need a model with this ORM
      throw new Error('To auto-generate a document ID, call docAutoId(model)')
    }

    const model = this.model.__mapDocumentModels(...args)

    if (!model) {
      throw new Error(oneLine`No document models found for this pattern:
        ${args.join(', ')}`)
    }

    const docPath = model.__makeFsRelPath(...args)

    if (!docPath) {
      throw new Error(oneLine`No document ID defined for this pattern:
        ${args.join(', ')}`)
    }

    return new deferredModules.DocumentReference({
      parent: this,
      model,
      __fsDocument: this.__fsCollection.doc(docPath),
    })
  }

  docAutoId(model) {
    return new deferredModules.DocumentReference({
      parent: this,
      model,
      __fsDocument: this.__fsCollection.doc(),
    })
  }

  add(model, data) {
    const doc = this.docAutoId(model)
    return doc.set(data, {merge: false})
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

  limit(limit) {
    const __fsQuery = this.__fsCollection.limit(limit)
    return new Query({
      collection: this,
      __fsQuery,
    })
  }

  where(fieldPath, opStr, value) {
    const __fsQuery = this.__fsCollection.where(fieldPath, opStr, value)
    return new Query({
      collection: this,
      __fsQuery,
    })
  }
}

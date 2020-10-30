// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, deferredModules, DocumentSetup, Query, QuerySnapshot} =
  require('./index')


module.exports = class CollectionReference {
  constructor({id, parent, references}) {
    this.database = parent.database
    this.parent = parent
    this.__fsCollection = parent.__fsDocument.collection(id)
    this.structure = references &&
      fn.makeStructure(this, references, DocumentSetup)
  }

  add(schema, data) {
    const doc = this.docAutoId(schema)
    return doc.set(data, {merge: false})
  }

  async deleteAll(chooseSchema) {
    const docs = await this.get(chooseSchema)

    return this.database.batchCommit((batch) => {
      docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
    })
  }

  doc(docPath, schema) {
    if (!docPath) {
      // The native collection objects support calling doc() without arguments
      // to auto-generate a document ID, but I need a schema with this ORM
      throw new Error('To auto-generate a document ID, call docAutoId(schema)')
    }

    return new deferredModules.DocumentReference({
      id: docPath,
      parent: this,
      schema,
    })
  }

  docAutoId(schema) {
    return new deferredModules.DocumentReference({
      parent: this,
      schema,
    })
  }

  async get(chooseSchema) {
    const __fsQuerySnapshot = await this.__fsCollection.get()
    return new QuerySnapshot({
      collection: this,
      chooseSchema,
      __fsQuerySnapshot,
    })
  }

  async *iter(chooseSchema) {
    const {docs} = await this.get(chooseSchema)
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

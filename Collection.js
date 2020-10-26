// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const Document = require('./Document')
const QuerySnapshot = require('./QuerySnapshot')


module.exports = class Collection {
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

    return new Document({
      parent: this,
      model,
      __fsDocument: parent.__fsCollection.doc(docPath),
    })
  }

  docAutoId(model) {
    return new Document({
      parent: this,
      model,
      __fsDocument: parent.__fsCollection.doc(),
    })
  }

  add(model, data) {
    const doc = this.docAutoId(model)
    return doc.set(data)
  }

  async get(chooseModel) {
    const __fsQuerySnapshot = await this.__fsCollection.get()
    return new QuerySnapshot({
      collection: this,
      chooseModel,
      __fsQuerySnapshot,
    })
  }
}

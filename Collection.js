// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const Document = require('./Document')


module.exports = class Collection {
  constructor({path, parent, model}) {
    this.database = parent.database
    this.parent = parent
    this.model = model
    this.__fsCollection = parent.__fsDocument.collection(path)
  }

  doc(args) {
    const model = this.model.__mapDocumentModels(args)

    return new Document({
      path: model.__makeFsPath(args),
      parent: this,
      model,
    })
  }
}

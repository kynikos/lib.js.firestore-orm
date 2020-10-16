// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = class CollectionModel {
  constructor({fsPath, documents}) {
    this.__makeFsPath = fsPath
    this.__mapDocumentModels = documents
  }
}

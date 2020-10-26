// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = class CollectionModel {
  constructor({fsRelPath, documents, methods}) {
    this.__makeFsRelPath = fsRelPath
    this.__mapDocumentModels = documents
    this.__additionalMethods = methods
  }
}

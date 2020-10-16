// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = class DocumentModel {
  constructor({fsPath, schema, collections, methods}) {
    this.__makeFsPath = fsPath
    this.schema = schema
    this.__mapCollectionModels = collections
    this.__additionalMethods = methods
  }
}

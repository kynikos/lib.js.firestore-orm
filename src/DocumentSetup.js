// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class DocumentSetup {
  constructor(docId, schema, references) {
    this.__id = docId
    this.__schema = schema
    this.__references = references
  }

  make(parent, ...args) {
    const document = new deferredModules.DocumentReference({
      id: args.length === 0 ? this.__id : this.__id(args[0]),
      parent,
      schema: this.__schema,
      references: this.__references,
    })
    return document.structure
  }
}

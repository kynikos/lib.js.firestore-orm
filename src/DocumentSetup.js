// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class DocumentSetup {
  constructor({path, schema, structure}) {
    this.__path = path
    this.schema = schema
    this.__structure = structure
  }

  make(parent, ...args) {
    const document = new deferredModules.DocumentReference({
      path: args.length === 0 ? this.__path : this.__path(args[0]),
      parent,
      schema: this.schema,
      structure: this.__structure,
    })
    return document.structure
  }
}

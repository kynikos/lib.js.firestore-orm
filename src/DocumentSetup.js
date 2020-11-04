// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {deferredModules} = require('./index')


module.exports = class DocumentSetup {
  constructor({path, schema, structure, hooks = {}}) {
    this.__path = path
    this.__schema = schema
    this.__structure = structure
    this.__hooks = {
      afterWritingDocument: hooks.afterWritingDocument,
    }
  }

  __make({parent, path, __fsDocument}) {
    let pPath
    let pFsDocument

    if (__fsDocument) {
      if (path) {
        throw new Error('Ambiguous document path: __fsDocument cannot be ' +
          'defined in make() if already set when instantiating DocumentSetup')
      }
      pFsDocument = __fsDocument
    } else if (this.__path) {
      if (typeof this.__path === 'function') {
        pPath = this.__path(path)
      } else if (path) {
        throw new Error('Ambiguous document path: path cannot be defined ' +
          'both when instantiating DocumentSetup and when running make()')
      } else {
        pPath = this.__path
      }
    } else {
      pPath = path
    }

    return new deferredModules.DocumentReference({
      path: pPath,
      __fsDocument: pFsDocument,
      parent,
      schema: this.__schema,
      structure: this.__structure,
      hooks: this.__hooks,
    })
  }

  make(parent, path) {
    const document = this.__make({parent, path})
    return document.structure
  }
}

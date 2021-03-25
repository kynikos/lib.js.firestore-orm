// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')
const {DocumentReference} = require('../index')


module.exports = class FieldDocumentReference extends Field {
  constructor(fieldName, options = {}) {
    const {pathToSetupAndParent, ...commonOptions} = options
    if (!pathToSetupAndParent) {
      throw new Error("'pathToSetupAndParent' is required")
    }
    super(fieldName, commonOptions)
    this.pathToSetupAndParent = pathToSetupAndParent
  }

  serializeNotNull(value, options, data) {
    if (!(value instanceof DocumentReference)) {
      throw new Error(`Value for ${this.name} is not a DocumentReference ` +
        'object')
    }

    return value.__fsDocument
  }

  deserialize(value, options, data) {
    return (database) => {
      const {setup, parent} = this.pathToSetupAndParent(
        database,
        value.__parent.path,
        value.path,
      )
      return setup.__makeFromReference(parent, value)
    }
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')
const {CollectionReference} = require('../index')


module.exports = class FieldCollectionReference extends Field {
  constructor(fieldName, options = {}) {
    const {pathToSetupAndParent, ...commonOptions} = options
    if (!pathToSetupAndParent) {
      throw new Error("'pathToSetupAndParent' is required")
    }
    super(fieldName, commonOptions)
    this.pathToSetupAndParent = pathToSetupAndParent
  }

  serializeNotNull(value) {
    if (!(value instanceof CollectionReference)) {
      throw new Error(`Value for ${this.name} is not a CollectionReference ` +
        'object')
    }

    // Unlike documents, Firestore can't store direct references to collections,
    // so store its path as a string
    return value.__fsCollection.path
  }

  deserialize(value) {
    return (database) => {
      const {setup, parent} = this.pathToSetupAndParent(database, value)
      return setup.__makeFromId(parent, value)
    }
  }
}

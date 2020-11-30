// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldDocumentReference} = require('./index')


module.exports = class FieldDocumentReferenceArray extends FieldDocumentReference {
  serializeNotNull(value, {coerce = true}, data) {
    if (!Array.isArray(value)) {
      throw new Error(`Value for ${this.name} is not an Array`)
    }

    const sData = value.map((item) => {
      return super.serializeNotNull(item, {coerce}, data)
    })

    return sData
  }

  deserialize(value, options, data) {
    return (database) => {
      return value.map((ref) => super.deserialize(ref, options, data)(database))
    }
  }
}

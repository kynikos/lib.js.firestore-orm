// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldCollectionReferenceGeneric} = require('./index')


module.exports = class FieldCollectionReferenceGenericArray extends FieldCollectionReferenceGeneric {
  serializeNotNull(value, {coerce = true}) {
    if (!Array.isArray(value)) {
      throw new Error(`Value for ${this.name} is not an Array`)
    }

    const sData = value.map((item) => {
      return super.serializeNotNull(item, {coerce})
    })

    return sData
  }

  deserialize(value) {
    return value.map((ref) => super.deserialize(ref))
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldArray extends Field {
  serializeNotNull(value) {
    const sData = value

    if (!Array.isArray(sData)) {
      throw new Error(`Value for ${this.name} is not an Array`)
    }

    return sData
  }

  deserialize(value) {
    return value
  }
}

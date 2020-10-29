// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldInteger extends Field {
  serializeNotNull(value, {coerce = true}) {
    let sData = value

    if (!(Number.isInteger(sData))) {
      sData = Number.parseInt(sData, 10)

      if (!coerce || !(Number.isInteger(sData))) {
        throw new Error(`Value for ${this.name} is not an integer number`)
      }
    }

    return sData
  }

  deserialize(value) {
    return value
  }
}

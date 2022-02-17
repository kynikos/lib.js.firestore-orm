// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldFloat extends Field {
  serializeNotNull(value, {coerce = true}, data) {
    let sData = value

    if (!(Number.isFinite(sData))) {
      sData = Number.parseFloat(sData)

      if (!coerce || !(Number.isFinite(sData))) {
        throw new Error(`Value for ${this.name} is not a float number`)
      }
    }

    return sData
  }
}

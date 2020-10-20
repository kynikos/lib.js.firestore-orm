// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const Field = require('./_Field')


module.exports = class FieldString extends Field {
  serializeNotNull(value, {coerce = true}) {
    let sData = value

    if (!(typeof sData === 'string' || sData instanceof String)) {
      if (coerce) {
        sData = String(sData, 10)
      } else {
        throw new Error(`Value for ${this.name} is not a string`)
      }
    }

    return sData
  }

  deserialize(value) {
    return value
  }
}

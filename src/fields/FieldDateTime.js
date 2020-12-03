// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldDateTime extends Field {
  serializeNotNull(value, {coerce = true}, data) {
    let sData = value

    if (!(sData instanceof Date)) {
      if (!coerce) {
        throw new Error(`Value for ${this.name} is not a valid Date object`)
      }
      sData = new Date(sData)
    }

    if (
      // https://stackoverflow.com/a/1353711
      isNaN(sData.getTime())
    ) {
      throw new Error(`Value for ${this.name} is not a valid Date object`)
    }

    return sData
  }

  deserialize(value, options, data) {
    // TODO: Firestore stores Timestamp objects; the docs say that toDate()
    //       may lose precision
    //       https://googleapis.dev/nodejs/firestore/latest/Timestamp.html#toDate
    //       Optionally keep it as a Timestamp?
    return value && value.toDate()
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {_FieldTimestamp} = require('./index')


module.exports = class FieldDateTime extends _FieldTimestamp {
  serializeNotNull(value, options = {}, data) {
    const {coerce = true} = options

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

    return super.serializeNotNull(sData, options, data)
  }
}

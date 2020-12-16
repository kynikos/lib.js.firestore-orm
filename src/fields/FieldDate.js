// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {_FieldTimestamp} = require('./index')


module.exports = class FieldDate extends _FieldTimestamp {
  serializeNotNull(value, options = {}, data) {
    const {coerce = true} = options

    let sData = value

    if (!(sData instanceof Date)) {
      if (!coerce) {
        throw new Error(`Value for ${this.name} is not a valid Date object`)
      }
      sData = new Date(sData)
    }

    if (!sData.toISOString().endsWith('T00:00:00.000Z')) {
      throw new Error(`Value for ${this.name} does not represent an exact ` +
        'date (for example a Date object at UTC midnight or a YYYY-MM-DD ' +
        'string)')
    }

    return super.serializeNotNull(sData, options, data)
  }

  deserialize(value, options, data) {
    // TODO: Only return a date
    // Make sure to return a timezone-agnostic string (i.e. not UTC), otherwise
    // clients in Western time zones may derive the previous date
    return super.deserialize(value, options, data).toISOString().slice(0, 10)
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const Field = require('./_Field')


module.exports = class FieldDateTime extends Field {
  constructor(fieldName, options = {}) {
    const {autoNow, ...commonOptions} = options
    super(commonOptions)
    this.autoNow = Boolean(autoNow)
  }

  serializeNotNull(value, {coerce = true}) {
    let sData

    if (!(value instanceof Date)) {
      if (!coerce) {
        throw new Error(`Value for ${this.name} is not a valid Date object`)
      }
      sData = new Date(value)
    }

    if (
      // https://stackoverflow.com/a/1353711
      isNaN(sData.getTime())
    ) {
      throw new Error(`Value for ${this.name} is not a valid Date object`)
    }

    return sData
  }

  serializeNoValueAlt() {
    if (this.autoNow) return new Date()
    return null
  }

  deserialize(value) {
    return value
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldDateTime extends Field {
  constructor(fieldName, options = {}) {
    const {autoNow, autoNowAdd, ...commonOptions} = options
    super(fieldName, commonOptions)
    this.autoNow = Boolean(autoNow)
    this.autoNowAdd = Boolean(autoNowAdd)
  }

  serializeNotNull(value, {coerce = true}) {
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

  serializeNoValueAlt() {
    if (this.autoNow || this.autoNowAdd) return new Date()
    return null
  }

  deserialize(value) {
    return value && value.toDate()
  }
}

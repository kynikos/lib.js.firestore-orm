// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldFixed extends Field {
  constructor(fieldName, options = {}) {
    const {digits, ...commonOptions} = options
    super(fieldName, commonOptions)
    this.digits = digits
  }

  serializeNotNull(value, {coerce = true}, data) {
    let sData = value

    if (typeof sData !== 'number') {
      sData = Number.parseFloat(sData)

      if (!coerce || Number.isNaN(sData)) {
        throw new Error(`Value for ${this.name} is not a number`)
      }
    }

    sData *= 10 ** this.digits

    return Number.parseInt(sData.toFixed(0), 10)
  }

  deserialize(value, options, data) {
    if (value == null) return value
    const dValue = value / (10 ** this.digits)
    return Number.parseFloat(dValue.toFixed(2))
  }
}

// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const FieldString = require('./FieldString')


module.exports = class FieldStringArray extends FieldString {
  serializeNotNull(value, {coerce = true}) {
    // super cannot be used inside the reducer function
    const superS = super.serializeNotNull

    if (!Array.isArray(value)) {
      throw new Error(`Value for ${this.name} is not an Array`)
    }

    const sData = Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = superS(val, {coerce})
      return acc
    }, {})

    return sData
  }
}
